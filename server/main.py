# server/main.py
"""FastAPI Backend Server for AeroCut AI by MCR.

Exposes endpoints for pipeline execution, capability menus, project management,
and serving generated media assets.
"""

import os
import sys
import shutil
import asyncio
from pathlib import Path
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# Add project root to python path so we can import tools and lib
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from tools.tool_registry import registry
from lib.pipeline_loader import load_pipeline, list_pipelines
from lib.checkpoint import STAGES, read_checkpoint, write_checkpoint

app = FastAPI(
    title="AeroCut AI by MCR API Server",
    description="Backend API to drive video production pipelines, query capabilities, and manage projects.",
    version="1.0.0"
)

# Enable CORS for frontend development server (Vite default port is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class ProjectCreate(BaseModel):
    name: str  # kebab-case project identifier
    pipeline: str  # e.g., "animated-explainer"
    prompt: Optional[str] = None

class EnvUpdate(BaseModel):
    keys: Dict[str, str]

# --- Helper functions ---
def get_projects_dir() -> Path:
    pdir = PROJECT_ROOT / "projects"
    pdir.mkdir(exist_ok=True)
    return pdir

# --- API Endpoints ---

@app.get("/api/capabilities")
def get_capabilities():
    """Discover available tools and return the rollup provider menu summary."""
    try:
        registry.discover()
        return registry.provider_menu_summary()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load capability catalog: {str(e)}")

@app.get("/api/pipelines")
def get_pipelines():
    """List all available video production pipelines in the system."""
    try:
        pipelines = []
        for name in list_pipelines():
            manifest = load_pipeline(name)
            pipelines.append({
                "name": manifest.get("name"),
                "version": manifest.get("version"),
                "description": manifest.get("description"),
                "category": manifest.get("category"),
                "stability": manifest.get("stability"),
                "stages": [s.get("name") for s in manifest.get("stages", [])]
            })
        return pipelines
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load pipelines: {str(e)}")

@app.get("/api/projects")
def list_projects():
    """List all active and completed projects in the workspace."""
    pdir = get_projects_dir()
    projects = []
    for path in pdir.iterdir():
        if not path.is_dir():
            continue
        
        # Look for checkpoints to determine current stage and status
        current_stage = "idea"
        status = "not_started"
        checkpoint_file = path / "artifacts" / "checkpoint.json" # Check standard project structure
        
        # Search for any checkpoint files under project folder
        stage_checkpoints = sorted(path.glob("checkpoint_*.json"))
        if stage_checkpoints:
            # Get latest stage
            latest = stage_checkpoints[-1]
            try:
                data = read_checkpoint(get_projects_dir(), path.name, latest.stem.replace("checkpoint_", ""))
                current_stage = data.get("stage", "idea")
                status = data.get("status", "completed")
            except Exception:
                pass
                
        projects.append({
            "name": path.name,
            "path": str(path),
            "current_stage": current_stage,
            "status": status,
            "has_renders": (path / "renders" / "final.mp4").is_file()
        })
    return projects

@app.post("/api/projects/new")
def create_project(req: ProjectCreate):
    """Initialize a new project directory with standard folder structure."""
    pdir = get_projects_dir()
    project_path = pdir / req.name
    
    if project_path.exists():
        raise HTTPException(status_code=400, detail=f"Project '{req.name}' already exists.")
        
    try:
        # Load pipeline and get its first stage
        manifest = load_pipeline(req.pipeline)
        stages = manifest.get("stages", [])
        if not stages:
            raise HTTPException(status_code=400, detail=f"Pipeline '{req.pipeline}' has no stages defined.")
        first_stage = stages[0].get("name")

        # Create standard folders
        (project_path / "artifacts").mkdir(parents=True, exist_ok=True)
        (project_path / "assets" / "images").mkdir(parents=True, exist_ok=True)
        (project_path / "assets" / "video").mkdir(parents=True, exist_ok=True)
        (project_path / "assets" / "audio").mkdir(parents=True, exist_ok=True)
        (project_path / "assets" / "music").mkdir(parents=True, exist_ok=True)
        (project_path / "renders").mkdir(parents=True, exist_ok=True)
        
        # Initialize default checkpoint
        initial_checkpoint = {
            "project_id": req.name,
            "pipeline": req.pipeline,
            "stage": first_stage,
            "status": "in_progress",
            "cost_usd": 0.0,
            "timestamp": "2026-06-22T13:30:00Z",
            "decision_log": [],
            "brief": {
                "topic": req.name.replace("-", " ").title(),
                "prompt": req.prompt or "",
                "duration_seconds": 60,
                "aspect_ratio": "16:9"
            }
        }
        
        # Save initial stage checkpoint
        write_checkpoint(
            get_projects_dir(),
            req.name,
            first_stage,
            "in_progress",
            artifacts={},
            pipeline_type=req.pipeline,
            metadata={"brief": initial_checkpoint["brief"]}
        )
        
        return {"status": "success", "project": req.name}
    except HTTPException:
        raise
    except Exception as e:
        if project_path.exists():
            shutil.rmtree(project_path)
        raise HTTPException(status_code=500, detail=f"Failed to create project: {str(e)}")

@app.delete("/api/projects/{name}")
def delete_project(name: str):
    """Delete a project directory permanently from disk."""
    pdir = get_projects_dir()
    project_path = pdir / name
    
    if not project_path.exists() or not project_path.is_dir():
        raise HTTPException(status_code=404, detail=f"Project '{name}' not found.")
        
    try:
        shutil.rmtree(project_path)
        return {"status": "success", "detail": f"Project '{name}' deleted permanently."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete project: {str(e)}")
@app.get("/api/projects/{name}/export")
def export_project(name: str):
    """Package the project directory artifacts and renders into a zip file and stream it."""
    import zipfile
    import io
    from fastapi.responses import StreamingResponse
    
    pdir = get_projects_dir()
    project_path = pdir / name
    
    if not project_path.exists() or not project_path.is_dir():
        raise HTTPException(status_code=404, detail=f"Project '{name}' not found.")
        
    zip_buffer = io.BytesIO()
    try:
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for root, dirs, files in os.walk(project_path):
                for file in files:
                    file_path = Path(root) / file
                    relative_path = file_path.relative_to(project_path)
                    zip_file.write(file_path, arcname=relative_path)
                    
        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={name}_export.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to export project: {str(e)}")

@app.get("/api/env")
def get_env():
    """Get list of environment variables needed and whether they are set."""
    env_path = PROJECT_ROOT / ".env"
    keys_status = {}
    
    # Standard keys from .env.example
    keys_to_check = [
        "FAL_KEY", "GOOGLE_API_KEY", "ELEVENLABS_API_KEY", "OPENAI_API_KEY",
        "XAI_API_KEY", "DOUBAO_SPEECH_API_KEY", "SUNO_API_KEY", "HEYGEN_API_KEY",
        "RUNWAY_API_KEY", "PEXELS_API_KEY", "PIXABAY_API_KEY", "UNSPLASH_ACCESS_KEY"
    ]
    
    for key in keys_to_check:
        keys_status[key] = bool(os.environ.get(key))
        
    return keys_status

@app.post("/api/env/update")
def update_env(req: EnvUpdate):
    """Save updated API keys to .env file."""
    env_path = PROJECT_ROOT / ".env"
    try:
        # Load existing env vars if file exists
        existing = {}
        if env_path.is_file():
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, _, v = line.partition("=")
                    existing[k.strip()] = v.strip().strip("'\"")
                    
        # Merge updates
        for k, v in req.keys.items():
            if v:
                existing[k] = v
                os.environ[k] = v
                
        # Write back to .env
        with open(env_path, "w", encoding="utf-8") as f:
            f.write("# AeroCut AI by MCR - Configured API Keys\n\n")
            for k, v in sorted(existing.items()):
                f.write(f"{k}={v}\n")
                
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write .env file: {str(e)}")

# Mount project folders for static asset rendering previews
try:
    app.mount("/media/projects", StaticFiles(directory=str(PROJECT_ROOT / "projects")), name="projects")
except RuntimeError:
    pass

# Mount final production build if it exists
web_dist = PROJECT_ROOT / "web-ui" / "dist"
if web_dist.exists():
    app.mount("/", StaticFiles(directory=str(web_dist), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
