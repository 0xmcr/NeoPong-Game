# AeroCut AI by MCR â€" Skill Index

> For the full agent onboarding guide, see [`AGENT_GUIDE.md`](../AGENT_GUIDE.md) in the project root.

This file lists all available Layer 2 skills and documents the 3-layer knowledge architecture.

## Knowledge Architecture

```
Layer 1: tools/tool_registry.py          "What tools exist and what they can do"
         tools/base_tool.py               Each tool declares: capabilities, tier, status,
                                          dependencies, cost, and agent_skills[]

         â†" agent_skills[] points to â†"

Layer 2: skills/                          "How AeroCut AI by MCR uses these tools"
         Project-specific conventions:     Pipeline integration, artifact mappings,
         {core,creative,meta,pipelines}/   enhancement chain order, quality checklists

         â†" references underlying tech in â†"

Layer 3: .agents/skills/                  "How the technology itself works"
         Generic API knowledge from        Correct import paths, code patterns,
         skills.sh (47 installed skills)   constraints, parameters â€" tech-agnostic
```

**How the agent uses this:**
1. The orchestrator queries Layer 1 (`tool_registry.support_envelope()`) to see what's available
2. Each tool's `agent_skills[]` field names the Layer 3 skills it relies on
3. Layer 2 skills (this directory) teach the agent AeroCut AI by MCR-specific conventions
4. Layer 3 skills (`.agents/skills/`) provide generic API knowledge, loaded on-demand

## Capability Families & Tool Discovery

Every tool declares a `capability` (what it does) and a `provider` (who/what powers it). The registry groups tools by capability so agents can discover all options for a given task.

### Selector / Provider Pattern

For capability families with multiple providers (TTS, video generation), the architecture uses:
- **Selector tool** (`tts_selector`, `video_selector`, `image_selector`) — routes to the best available provider based on requirements, API key availability, and cost. Selectors auto-discover providers from the registry. Agents should default to selectors when the user hasn't specified a provider.
- **Provider tools** — call a specific provider directly. Agents use these when the user explicitly requests a provider or when the selector's routing isn't appropriate.

### Capability Family Reference

**Do not maintain a hardcoded tool list.** The registry is the single source of truth. Query it at runtime:

```bash
python -c "from tools.tool_registry import registry; import json; registry.discover(); print(json.dumps(registry.capability_catalog(), indent=2))"
```

Key capability families to look for in the output:

| Capability | Selector | Discovery |
|---|---|---|
| `tts` | `tts_selector` | Auto-discovers all `capability="tts"` tools |
| `video_generation` | `video_selector` | Auto-discovers all `capability="video_generation"` tools |
| `image_generation` | `image_selector` | Auto-discovers all `capability="image_generation"` tools |
| `audio_processing` | — | FFmpeg-based local tools |
| `enhancement` | — | Mixed providers |
| `analysis` | — | Mixed providers |
| `character_animation` | — | Local character specs, SVG rigs, pose libraries, action timelines, previews, and QA |
| `graphics` | — | Local rendering tools |
| `music_generation` | — | Single-provider |
| `subtitle` | — | Pure Python |
| `avatar` | — | Local GPU models |
| `video_post` | — | FFmpeg-based local tools |

### Adding New Tools

1. Place the tool in the correct capability folder (or create a new one under `tools/`)
2. Set `capability` and `provider` in the class definition
3. If joining a multi-provider family, the existing selector discovers it automatically
4. Attach relevant Layer 2 and Layer 3 skills via `agent_skills[]`
5. The registry discovers tools automatically — no manual registration needed
6. **No other files need updating** — selectors, manifests, and instructions all derive from the registry

## Core Skills

| Skill | File | Trigger | Agent Skills (Layer 3) |
|-------|------|---------|----------------------|
| FFmpeg | `core/ffmpeg.md` | Video encoding, filtering, composition | `ffmpeg`, `video_toolkit` |
| Remotion | `core/remotion.md` | React-based composition, Phase 3+ | `remotion-best-practices`, `remotion` |
| HyperFrames | `core/hyperframes.md` | HTML/CSS/GSAP composition runtime — kinetic typography, product promos, website-to-video, registry blocks | `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `website-to-hyperframes`, `gsap-core`, `gsap-timeline` |
| WhisperX | `core/whisperx.md` | Transcription with word-level timestamps | `speech-to-text` |
| Subtitle Sync | `core/subtitle-sync.md` | Subtitle timing and alignment | `remotion-best-practices` |
| Color Grading | `core/color-grading.md` | FFmpeg color profiles, LUT workflow, accessibility | `ffmpeg` |

## Creative Skills

| Skill | File | Trigger | Agent Skills (Layer 3) |
|-------|------|---------|----------------------|
| Video Editing | `creative/video-editing.md` | Cut decisions, pacing, rhythm | `ffmpeg`, `video_toolkit` |
| Enhancement Strategy | `creative/enhancement-strategy.md` | Overlay placement and density | `ffmpeg` |
| Data Visualization | `creative/data-visualization.md` | Chart type selection, animation, label placement | `d3-viz`, `remotion-best-practices` |
| Video Stitching | `creative/video-stitching.md` | Multi-clip assembly, AI clip chaining, spatial composition | `ffmpeg`, `video_toolkit` |
| Video Gen Prompting | `creative/video-gen-prompting.md` | Universal video generation prompt vocabulary; **canonical 5-aspect spec** (Subject / Motion / Scene / Spatial / Camera); ~200 cinematography primitives | `ai-video-gen`, `ltx2`, `create-video` |
| â†³ Seedance Prompting | `creative/prompting/seedance-prompting.md` | **Preferred premium default.** Seedance 2.0 8-component structure, multi-shot, lip-sync, reference-to-video | `seedance-2-0`, `ai-video-gen` |
| â†³ Grok Prompting | `creative/prompting/grok-prompting.md` | Grok image/video prompting, edit flows, reference-image video | `grok-media` |
| â†³ Sora Prompting | `creative/prompting/sora-prompting.md` | Sora 2 structured template, advanced fields | `ai-video-gen` |
| â†³ VEO Prompting | `creative/prompting/veo-prompting.md` | VEO 3.1 14-component structure, art movements | `ai-video-gen` |
| â†³ LTX Prompting | `creative/prompting/ltx-prompting.md` | LTX-2 6-element structure, audio prompting | `ltx2` |
| â†³ HunyuanVideo Prompting | `creative/prompting/hunyuan-prompting.md` | HunyuanVideo formula, I2V best practices | â€" |
| Storytelling | `creative/storytelling.md` | Narrative structure, hooks, pacing, Mayer's principles | â€" |
| Sound Design | `creative/sound-design.md` | Audio ducking, LUFS targets, SFX timing, AI TTS mixing | `elevenlabs` |
| Typography | `creative/typography.md` | Font selection, text sizing, safe zones, caption styling | â€" |
| ManimCE Usage | `creative/manim-usage.md` | Scene composition, animation timing, color usage | `manimce-best-practices` |
| Image Gen Usage | `creative/image-gen-usage.md` | Prompt consistency, hero reference, batch strategy | `flux-best-practices`, `bfl-api` |
| Image Provider Usage | `creative/image-provider-usage.md` | Provider selection (FLUX/Grok/OpenAI/Recraft/stock), cost-quality tradeoffs | `flux-best-practices`, `bfl-api`, `grok-media` |
| B-Roll Planning | `creative/broll-planning.md` | Stock vs. generated decision, query construction, footage evaluation | — |
| Stock Sourcing Usage | `creative/stock-sourcing-usage.md` | Pexels/Pixabay usage, parameters, licensing, integration | — |
| Scene Detect Usage | `creative/scene-detect-usage.md` | Threshold tuning, algorithm selection, content presets | â€" |
| Diagram Gen Usage | `creative/diagram-gen-usage.md` | Complexity limits, progressive building, themes | `beautiful-mermaid` |
| Music Gen Usage | `creative/music-gen-usage.md` | BPM selection, prompt engineering, duration matching | `music`, `elevenlabs` |
| Background Removal | `creative/bg-remove-usage.md` | Model selection, alpha matting, compositing workflows | â€" |
| Upscaling | `creative/upscale-usage.md` | Scale factor, model selection, face-aware upscaling | â€" |
| Face Restoration | `creative/face-restore-usage.md` | CodeFormer/GFPGAN selection, fidelity tuning, vs face_enhance | â€" |
| Lip Sync | `creative/lip-sync-usage.md` | Wav2Lip model selection, dubbing workflows, input requirements | `faceswap` |
| Talking Head Gen | `creative/talking-head-gen-usage.md` | SadTalker/MuseTalk, photo-to-video, expression tuning | `avatar-video` |
| Video Understanding | `creative/video-understand-usage.md` | Visual QA, quality gating, scene classification | `video-understand` |

## Pipeline Type Skills

Pipeline type skills provide production guidance for specific video formats, independent of the animated-explainer or talking-head pipeline.

| Skill | File | When to Use |
|-------|------|-------------|
| Short-Form | `creative/short-form.md` | TikTok, Reels, Shorts â€" vertical 9:16, under 60s |
| Long-Form | `creative/long-form.md` | YouTube 10+ min â€" chapters, retention, end screens |
| Screen Recording | `creative/screen-recording.md` | Code walkthroughs, tutorials, software demos |
| Animation Pipeline | `creative/animation-pipeline.md` | Motion graphics, easing, transitions, composition |
| Character Animation Pipeline | `pipelines/character-animation/` | Rigged local cartoon characters, pose libraries, action timelines, SVG/Canvas/Remotion/HyperFrames rendering |
| Cinematic | `creative/cinematic.md` | Letterbox, film pacing, layered audio, color grading |

## Pipeline Stage Director Skills

Stage director skills teach the agent HOW to execute each pipeline stage. Each skill is a detailed markdown file with process steps, quality rubrics, and self-evaluation criteria.

### Animated Explainer Pipeline (`pipelines/explainer/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/explainer/mcr-executive-producer.md` | `all` | **8-stage serial orchestration, quality gates, cross-stage checks, send-back** |
| **MCR Research Director** | `pipelines/explainer/mcr-research-director.md` | `research` | **Web research methodology, 5 search batches, landscape/trending/data/audience/expert analysis** |
| **MCR Proposal Director** | `pipelines/explainer/mcr-proposal-director.md` | `proposal` | **Concept options from research, production plan, cost estimate, approval gate** |
| MCR Script Director | `pipelines/explainer/mcr-script-director.md` | `script` | Narrative architecture, timing, enhancement cues, research integration |
| MCR Scene Director | `pipelines/explainer/mcr-scene-director.md` | `scene_plan` | Visual planning, technique library, feasibility |
| MCR Asset Director | `pipelines/explainer/mcr-asset-director.md` | `assets` | TTS, image gen, diagram gen, music, budget |
| MCR Edit Director | `pipelines/explainer/mcr-edit-director.md` | `edit` | Timeline assembly, subtitles, audio ducking |
| MCR Compose Director | `pipelines/explainer/mcr-compose-director.md` | `compose` | FFmpeg/Remotion render, audio mixing |
| MCR Publish Director | `pipelines/explainer/mcr-publish-director.md` | `publish` | SEO metadata, chapters, export packaging |

> **Note:** The old `mcr-idea-director.md` still exists for reference but is superseded by the research + proposal two-stage flow in v2.0. The talking-head pipeline continues to use its own `mcr-idea-director`.

### Talking Head Pipeline (`pipelines/talking-head/`)

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| MCR Idea Director | `pipelines/talking-head/mcr-idea-director.md` | `idea` | Footage inspection, content assessment |
| MCR Script Director | `pipelines/talking-head/mcr-script-director.md` | `script` | Transcription, section segmentation |
| MCR Scene Director | `pipelines/talking-head/mcr-scene-director.md` | `scene_plan` | Enhancement planning, overlay placement |
| MCR Asset Director | `pipelines/talking-head/mcr-asset-director.md` | `assets` | Subtitle gen, audio extraction |
| MCR Edit Director | `pipelines/talking-head/mcr-edit-director.md` | `edit` | Cut assembly, subtitle config |
| MCR Compose Director | `pipelines/talking-head/mcr-compose-director.md` | `compose` | Enhancement chain, render |
| MCR Publish Director | `pipelines/talking-head/mcr-publish-director.md` | `publish` | Metadata, export packaging |

### Screen Demo Pipeline (`pipelines/screen-demo/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/screen-demo/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, legibility gates, audio clarity, pacing checks** |
| MCR Idea Director | `pipelines/screen-demo/mcr-idea-director.md` | `idea` | Workflow scoping, UI density assessment, output-shape choice |
| MCR Script Director | `pipelines/screen-demo/mcr-script-director.md` | `script` | Action mapping, procedural narration, speed planning |
| MCR Scene Director | `pipelines/screen-demo/mcr-scene-director.md` | `scene_plan` | Crop planning, callout restraint, aspect-ratio viability |
| MCR Asset Director | `pipelines/screen-demo/mcr-asset-director.md` | `assets` | Subtitle-first asset kit, audio cleanup, reusable overlays |
| MCR Edit Director | `pipelines/screen-demo/mcr-edit-director.md` | `edit` | Tight timeline planning, speed notes, subtitle zone control |
| MCR Compose Director | `pipelines/screen-demo/mcr-compose-director.md` | `compose` | Legibility-first render, crisp screen output, verification |
| MCR Publish Director | `pipelines/screen-demo/mcr-publish-director.md` | `publish` | Searchable metadata, chapter packaging, thumbnail concepts |

### Clip Factory Pipeline (`pipelines/clip-factory/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/clip-factory/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, clip selection gates, batch consistency, hook placement** |
| MCR Idea Director | `pipelines/clip-factory/mcr-idea-director.md` | `idea` | Batch strategy, clip families, yield planning |
| MCR Script Director | `pipelines/clip-factory/mcr-script-director.md` | `script` | Transcript mining, ranking, standalone validation |
| MCR Scene Director | `pipelines/clip-factory/mcr-scene-director.md` | `scene_plan` | Platform framing, safe zones, crop-viability planning |
| MCR Asset Director | `pipelines/clip-factory/mcr-asset-director.md` | `assets` | Shared brand kit, rebased subtitles, batch audio consistency |
| MCR Edit Director | `pipelines/clip-factory/mcr-edit-director.md` | `edit` | Hook-first mini-edits, series consistency |
| MCR Compose Director | `pipelines/clip-factory/mcr-compose-director.md` | `compose` | Multi-job rendering, batch resilience, per-output verification |
| MCR Publish Director | `pipelines/clip-factory/mcr-publish-director.md` | `publish` | Posting order, platform copy, batch cataloging |

### Podcast Repurpose Pipeline (`pipelines/podcast-repurpose/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/podcast-repurpose/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, audio preservation gates, clip quality, multi-deliverable** |
| MCR Idea Director | `pipelines/podcast-repurpose/mcr-idea-director.md` | `idea` | Deliverable mix by source mode, realistic long-form planning |
| MCR Script Director | `pipelines/podcast-repurpose/mcr-script-director.md` | `script` | Diarized transcript truth, highlight ranking, chapter mapping |
| MCR Scene Director | `pipelines/podcast-repurpose/mcr-scene-director.md` | `scene_plan` | Source-faithful treatments, audiogram vs quote vs companion planning |
| MCR Asset Director | `pipelines/podcast-repurpose/mcr-asset-director.md` | `assets` | Subtitle-first packaging, speaker assets, optional topic art |
| MCR Edit Director | `pipelines/podcast-repurpose/mcr-edit-director.md` | `edit` | Hook-led podcast clips, quote hold time, companion simplicity |
| MCR Compose Director | `pipelines/podcast-repurpose/mcr-compose-director.md` | `compose` | Audio-first rendering, deliverable prioritization |
| MCR Publish Director | `pipelines/podcast-repurpose/mcr-publish-director.md` | `publish` | Episode cross-linking, guest attribution, staggered release logic |

### Cinematic Pipeline (`pipelines/cinematic/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/cinematic/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, emotional pacing gates, color consistency, audio dynamics** |
| MCR Idea Director | `pipelines/cinematic/mcr-idea-director.md` | `idea` | Emotional arc selection, source truth, delivery-shape planning |
| MCR Script Director | `pipelines/cinematic/mcr-script-director.md` | `script` | Beat mapping, dialogue selects, title-card restraint |
| MCR Scene Director | `pipelines/cinematic/mcr-scene-director.md` | `scene_plan` | Hero-frame planning, reveal structure, transition limits |
| MCR Asset Director | `pipelines/cinematic/mcr-asset-director.md` | `assets` | Source selects, support-insert discipline, music/ambience planning |
| MCR Edit Director | `pipelines/cinematic/mcr-edit-director.md` | `edit` | Emotion-first pacing, reveal timing, audio-driven rhythm |
| MCR Compose Director | `pipelines/cinematic/mcr-compose-director.md` | `compose` | Grade and mix finishing, frame-treatment judgment |
| MCR Publish Director | `pipelines/cinematic/mcr-publish-director.md` | `publish` | Hero vs teaser packaging, poster-frame concepts |

### Animation Pipeline (`pipelines/animation/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/animation/mcr-executive-producer.md` | `all` | **8-stage serial orchestration, quality gates, motion consistency, math accuracy checks** |
| **MCR Research Director** | `pipelines/animation/mcr-research-director.md` | `research` | **Topic + animation technique research, visual reference scan, mode-informed angles** |
| **MCR Proposal Director** | `pipelines/animation/mcr-proposal-director.md` | `proposal` | **Animation mode selection (Manim/Remotion/AI/diagram), reuse strategy, cost estimate, approval gate** |
| MCR Script Director | `pipelines/animation/mcr-script-director.md` | `script` | Animation-ready beats, text restraint, research integration, mode-aware writing |
| MCR Scene Director | `pipelines/animation/mcr-scene-director.md` | `scene_plan` | Animatic planning, transition systems, tool-path mapping |
| MCR Asset Director | `pipelines/animation/mcr-asset-director.md` | `assets` | Deterministic asset choice, reusable motifs, feasibility truth |
| MCR Edit Director | `pipelines/animation/mcr-edit-director.md` | `edit` | Hold timing, stagger rules, readable motion planning |
| MCR Compose Director | `pipelines/animation/mcr-compose-director.md` | `compose` | Sharp render output, timing integrity, safe-zone checks |
| MCR Publish Director | `pipelines/animation/mcr-publish-director.md` | `publish` | Animation-mode packaging, thumbnail-system alignment |

> **Note:** The old `mcr-idea-director.md` still exists for reference but is superseded by the research + proposal two-stage flow in v2.0.

### Hybrid Pipeline (`pipelines/hybrid/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/hybrid/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, source/support balance gates, overlay density, coherence** |
| MCR Idea Director | `pipelines/hybrid/mcr-idea-director.md` | `idea` | Anchor-medium selection, support-layer planning, fallback visibility |
| MCR Script Director | `pipelines/hybrid/mcr-script-director.md` | `script` | Source-vs-support beat mapping, dialogue retention, support justification |
| MCR Scene Director | `pipelines/hybrid/mcr-scene-director.md` | `scene_plan` | Source-primary layout rules, overlay density control, variant-safe planning |
| MCR Asset Director | `pipelines/hybrid/mcr-asset-director.md` | `assets` | Shared support kits, source-vs-generated asset tracking |
| MCR Edit Director | `pipelines/hybrid/mcr-edit-director.md` | `edit` | Anchor-cut-first workflow, layered support timing, readable variants |
| MCR Compose Director | `pipelines/hybrid/mcr-compose-director.md` | `compose` | Source/support balance checks, variant verification, coherent mix |
| MCR Publish Director | `pipelines/hybrid/mcr-publish-director.md` | `publish` | Master-vs-derivative packaging, source-mix metadata |

### Avatar Spokesperson Pipeline (`pipelines/avatar-spokesperson/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/avatar-spokesperson/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, lip-sync quality gates, presenter framing, CTA landing** |
| MCR Idea Director | `pipelines/avatar-spokesperson/mcr-idea-director.md` | `idea` | Avatar-path classification, CTA scoping, capability truth |
| MCR Script Director | `pipelines/avatar-spokesperson/mcr-script-director.md` | `script` | Spoken-copy shaping, scene-safe pacing, text restraint |
| MCR Scene Director | `pipelines/avatar-spokesperson/mcr-scene-director.md` | `scene_plan` | Presenter layout, background discipline, variant realism |
| MCR Asset Director | `pipelines/avatar-spokesperson/mcr-asset-director.md` | `assets` | Avatar-path locking, narration resolution, minimal support kits |
| MCR Edit Director | `pipelines/avatar-spokesperson/mcr-edit-director.md` | `edit` | Presenter-first cut planning, overlay timing, CTA landing |
| MCR Compose Director | `pipelines/avatar-spokesperson/mcr-compose-director.md` | `compose` | Lip-sync verification, subtitle-safe framing, clean render checks |
| MCR Publish Director | `pipelines/avatar-spokesperson/mcr-publish-director.md` | `publish` | Audience-led packaging, presenter-first thumbnail concepts |

### Localization Dub Pipeline (`pipelines/localization-dub/`) — v2.0

| Skill | File | Stage | Key Capabilities |
|-------|------|-------|-----------------|
| **MCR Executive Producer** | `pipelines/localization-dub/mcr-executive-producer.md` | `all` | **7-stage serial orchestration, translation accuracy gates, timing preservation, per-locale QA** |
| MCR Idea Director | `pipelines/localization-dub/mcr-idea-director.md` | `idea` | Scope definition, locale planning, glossary and review capture |
| MCR Script Director | `pipelines/localization-dub/mcr-script-director.md` | `script` | Transcript truth, translated script packaging, term preservation |
| MCR Scene Director | `pipelines/localization-dub/mcr-scene-director.md` | `scene_plan` | Dub-mode selection, timing-risk mapping, on-screen text planning |
| MCR Asset Director | `pipelines/localization-dub/mcr-asset-director.md` | `assets` | Subtitle-first localization kit, dubbed audio generation, optional lip sync |
| MCR Edit Director | `pipelines/localization-dub/mcr-edit-director.md` | `edit` | Locale-specific timelines, coverage planning, timing adjustments |
| MCR Compose Director | `pipelines/localization-dub/mcr-compose-director.md` | `compose` | Per-locale rendering, subtitle-fit checks, output labeling |
| MCR Publish Director | `pipelines/localization-dub/mcr-publish-director.md` | `publish` | Locale packaging, metadata precision, QA-note retention |

## Meta Skills

Cross-cutting skills that apply to all pipelines:

| Skill | File | Purpose |
|-------|------|---------|
| Onboarding | `meta/onboarding.md` | First-interaction greeting, capability discovery, starter prompts |
| Reviewer | `meta/reviewer.md` | Self-review protocol after every stage |
| Checkpoint Protocol | `meta/checkpoint-protocol.md` | When/how to checkpoint and request human approval |
| Skill Creator | `meta/skill-creator.md` | Dynamically create new skills during pipeline runs |

## Style Playbooks

Style playbooks (`styles/*.yaml`) define visual language, typography, motion, audio, and asset generation constraints. They are validated against `schemas/styles/playbook.schema.json`.

| Playbook | Category | Mood | Best For |
|----------|----------|------|----------|
| `clean-professional` | motion-graphics | polished, trustworthy | Corporate, educational, SaaS |
| `flat-motion-graphics` | motion-graphics | energetic, bold | Social media, TikTok, startups |
| `minimalist-diagram` | whiteboard | focused, technical | Technical deep-dives, architecture |

Load via `styles/playbook_loader.py`: `load_playbook("clean-professional")`

## Installed Agent Skills (Layer 3)

All agent skills live in `.agents/skills/` and are managed via `npx skills add`.
Claude Code accesses them via symlinks in `.claude/skills/`.

| Category | Installed Skills | Source |
|----------|-----------------|--------|
| **Video Composition** | `remotion-best-practices`, `remotion`, `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `website-to-hyperframes` | `remotion-dev/skills`, `digitalsamba/claude-code-video-toolkit`, `heygen-com/hyperframes` |
| **Video Processing** | `ffmpeg`, `video_toolkit` | `digitalsamba/claude-code-video-toolkit` |
| **TTS & Audio** | `text-to-speech`, `speech-to-text`, `music`, `sound-effects`, `elevenlabs`, `agents`, `setup-api-key` | `elevenlabs/skills`, `digitalsamba/claude-code-video-toolkit` |
| **Image Generation** | `flux-best-practices`, `bfl-api`, `grok-media` | `black-forest-labs/skills`, local AeroCut AI by MCR skill |
| **Math Animation** | `manimce-best-practices`, `manimgl-best-practices`, `manim-composer` | `adithya-s-k/manim_skill` |
| **3D Graphics** | `threejs-animation`, `threejs-fundamentals`, `threejs-geometry`, `threejs-interaction`, `threejs-lighting`, `threejs-loaders`, `threejs-materials`, `threejs-postprocessing`, `threejs-shaders`, `threejs-textures` | `cloudai-x/threejs-skills` |
| **Diagrams** | `beautiful-mermaid`, `d3-viz` | `intellectronica/agent-skills`, `davila7/claude-code-templates` |
| **Animation** | `framer-motion`, `lottie-bodymovin` | `pproenca/dot-skills`, `dylantarre/animation-principles` |
| **Design** | `tailwind-design-system`, `web-design-guidelines`, `vercel-react-best-practices`, `vercel-composition-patterns` | `wshobson/agents`, `vercel-labs/agent-skills` |
| **AI Video (HeyGen)** | `heygen`, `avatar-video`, `create-video`, `faceswap`, `ai-video-gen`, `video-download`, `video-edit`, `video-translate`, `video-understand`, `visual-style` | `heygen-com/skills` |
| **AI Video (Premium)** | `seedance-2-0` — preferred premium default (cinematic, trailer, multi-shot, lip-sync, synced audio); accessed via `seedance_video` (fal.ai) or `heygen_video` Avatar Shots | Local AeroCut AI by MCR skill |
| **Infrastructure** | `acestep`, `ltx2`, `playwright-recording` | `digitalsamba/claude-code-video-toolkit` |
