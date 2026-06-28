import React, { useState, useEffect, useRef } from "react";
import {
  Settings,
  FolderOpen,
  PlusCircle,
  Play,
  Cpu,
  CheckCircle,
  RefreshCw,
  Terminal,
  Key,
  Layers,
  Sparkles,
  Eye,
  Trash2
} from "lucide-react";

const STAGES = ["research", "proposal", "script", "scene_plan", "assets", "edit", "compose", "publish"];

const API_KEY_INFO: Record<string, { label: string; url: string; help: string }> = {
  OPENAI_API_KEY: {
    label: "OpenAI API Key",
    url: "https://platform.openai.com/api-keys",
    help: "Used for script writing, scene planning, and editor LLM reasoning."
  },
  GOOGLE_API_KEY: {
    label: "Google Gemini API Key",
    url: "https://aistudio.google.com/app/apikey",
    help: "Used for Gemini reasoning, translation, and media analysis."
  },
  ELEVENLABS_API_KEY: {
    label: "ElevenLabs API Key",
    url: "https://elevenlabs.io/app/settings/api-keys",
    help: "Used for high-fidelity text-to-speech voiceovers."
  },
  FAL_KEY: {
    label: "Fal.ai API Key",
    url: "https://fal.ai/dashboard/keys",
    help: "Used for image generation (Flux, SD3) and video generation."
  },
  XAI_API_KEY: {
    label: "xAI (Grok) API Key",
    url: "https://console.x.ai",
    help: "Used for Grok reasoning and text-to-image generation."
  },
  DOUBAO_SPEECH_API_KEY: {
    label: "Doubao Speech API Key",
    url: "https://console.volcengine.com",
    help: "Used for Volcano Engine Chinese/bilingual text-to-speech."
  },
  SUNO_API_KEY: {
    label: "Suno AI API Key",
    url: "https://suno.com",
    help: "Used for generating background music tracks."
  },
  HEYGEN_API_KEY: {
    label: "HeyGen API Key",
    url: "https://app.heygen.com",
    help: "Used for avatar spokesperson video generation."
  },
  RUNWAY_API_KEY: {
    label: "Runway API Key",
    url: "https://runwayml.com",
    help: "Used for advanced generative video (Gen-2/Gen-3)."
  },
  PEXELS_API_KEY: {
    label: "Pexels API Key",
    url: "https://www.pexels.com/api/",
    help: "Used for searching and retrieving free stock footage."
  },
  PIXABAY_API_KEY: {
    label: "Pixabay API Key",
    url: "https://pixabay.com/api/docs/",
    help: "Used for free stock music, images, and videos."
  },
  UNSPLASH_ACCESS_KEY: {
    label: "Unsplash Access Key",
    url: "https://unsplash.com/developers",
    help: "Used for high-quality stock photography search."
  }
};

const TRANSLATIONS = {
  en: {
    title: "AeroCut AI",
    subtitle: "The Premium AI-Orchestrated Video Studio",
    projectsTab: "Projects",
    newTab: "New",
    keysTab: "Keys",
    activeCapabilities: "Active System Capabilities",
    projectsHeader: "Workspace Folders",
    noProjects: "No projects found. Go to 'New' tab to initialize your first video!",
    welcomeTitle: "Welcome to AeroCut AI Studio",
    welcomeSubtitle: "Create or select a video production project from the left panel. Choose a template, outline your brief, and let the agent guide you stage-by-stage to a final high-quality render.",
    initializePipeline: "Initialize Pipeline",
    projectNameLabel: "Project Name (kebab-case)",
    pipelineTemplateLabel: "Pipeline Template",
    promptLabel: "Topic Description / Prompt",
    btnInitialize: "Initialize Project",
    btnUpdateKeys: "Update API Keys",
    apiKeyManager: "API Key Manager",
    envConfigured: "Configured",
    envMissing: "Missing",
    inputPlaceholderKey: "Paste your API key",
    inputPlaceholderKeySaved: "••••••••••••••••",
    backendActive: "Backend: Active",
    runPipeline: "Run Pipeline",
    logsConsole: "Real-time Terminal Logs",
    btnRunStage: "Execute Next Stage"
  },
  bn: {
    title: "অ্যারোকাট এআই",
    subtitle: "প্রিমিয়াম এআই-পরিচালিত ভিডিও স্টুডিও",
    projectsTab: "প্রজেক্টসমূহ",
    newTab: "নতুন প্রজেক্ট",
    keysTab: "এপিআই কী",
    activeCapabilities: "সিস্টেমের সক্রিয় এআই ক্ষমতা",
    projectsHeader: "প্রজেক্ট ফোল্ডারসমূহ",
    noProjects: "কোনো প্রজেক্ট পাওয়া যায়নি। আপনার প্রথম ভিডিও শুরু করতে 'নতুন প্রজেক্ট' ট্যাবে যান!",
    welcomeTitle: "অ্যারোকাট এআই স্টুডিওতে স্বাগতম",
    welcomeSubtitle: "বাম প্যানেল থেকে একটি ভিডিও প্রজেক্ট তৈরি বা সিলেক্ট করুন। টেমপ্লেট বেছে নিয়ে আপনার আইডিয়া লিখুন, এবং এআই এজেন্ট আপনাকে ধাপে ধাপে ফাইনাল হাই-কোয়ালিটি ভিডিও রেন্ডারে গাইড করবে।",
    initializePipeline: "পাইপলাইন শুরু করুন",
    projectNameLabel: "প্রজেক্টের নাম (ছোট হাতের অক্ষরে)",
    pipelineTemplateLabel: "পাইপলাইন টেমপ্লেট",
    promptLabel: "ভিডিওর বিষয়বস্তু / প্রম্পট",
    btnInitialize: "প্রজেক্ট তৈরি করুন",
    btnUpdateKeys: "এপিআই কী সেভ করুন",
    apiKeyManager: "এপিআই কী ম্যানেজার",
    envConfigured: "সংযুক্ত",
    envMissing: "অনুপস্থিত",
    inputPlaceholderKey: "আপনার এপিআই কী পেস্ট করুন",
    inputPlaceholderKeySaved: "••••••••••••••••",
    backendActive: "ব্যাকএন্ড: সক্রিয়",
    runPipeline: "পাইপলাইন রান করুন",
    logsConsole: "রিয়েল-টাইม টার্মিনাল লগ",
    btnRunStage: "পরবর্তী ধাপ চালান"
  },
  es: {
    title: "AeroCut AI",
    subtitle: "El estudio de video premium orquestado por IA",
    projectsTab: "Proyectos",
    newTab: "Nuevo",
    keysTab: "Claves",
    activeCapabilities: "Capacidades activas del sistema",
    projectsHeader: "Carpetas de espacio de trabajo",
    noProjects: "No se encontraron proyectos. ¡Ve a la pestaña 'Nuevo' para iniciar tu primer video!",
    welcomeTitle: "Bienvenido a AeroCut AI Studio",
    welcomeSubtitle: "Crea o selecciona un proyecto de producción de video en el panel izquierdo. Elige una plantilla, describe tu idea y deja que el agente te guíe paso a paso hasta el render final de alta calidad.",
    initializePipeline: "Inicializar tubería",
    projectNameLabel: "Nombre del proyecto (kebab-case)",
    pipelineTemplateLabel: "Plantilla de tubería",
    promptLabel: "Descripción del tema / Prompt",
    btnInitialize: "Inicializar proyecto",
    btnUpdateKeys: "Guardar claves API",
    apiKeyManager: "Administrador de claves API",
    envConfigured: "Configurado",
    envMissing: "Faltante",
    inputPlaceholderKey: "Pega tu clave API aquí",
    inputPlaceholderKeySaved: "••••••••••••••••",
    backendActive: "Backend: Activo",
    runPipeline: "Ejecutar tubería",
    logsConsole: "Registros de terminal en tiempo real",
    btnRunStage: "Ejecutar siguiente etapa"
  },
  hi: {
    title: "एरोकट एआई",
    subtitle: "प्रीमियम एआई-संचालित वीडियो स्टूडियो",
    projectsTab: "परियोजनाएं",
    newTab: "नई परियोजना",
    keysTab: "एपीआई कुंजी",
    activeCapabilities: "सक्रिय प्रणाली क्षमताएं",
    projectsHeader: "कार्यक्षेत्र फ़ोल्डर",
    noProjects: "कोई परियोजना नहीं मिली। अपना पहला वीडियो शुरू करने के लिए 'नई परियोजना' टैब पर जाएं!",
    welcomeTitle: "एरोकट एआई स्टूडियो में आपका स्वागत है",
    welcomeSubtitle: "बाएं पैनल से वीडियो उत्पादन परियोजना बनाएं या चुनें। एक टेम्पलेट चुनें, अपनी संक्षिप्त रूपरेखा तैयार करें, और एआई एजेंट को अंतिम उच्च-गुणवत्ता वाले रेंडर के लिए चरण-दर-चरण मार्गदर्शन करने दें।",
    initializePipeline: "पाइपलाइन प्रारंभ करें",
    projectNameLabel: "परियोजना का नाम (kebab-case)",
    pipelineTemplateLabel: "पाइपलाइन टेम्पलेट",
    promptLabel: "विषय विवरण / प्रॉम्ट",
    btnInitialize: "परियोजना बनाएं",
    btnUpdateKeys: "एपीआई कुंजी सहेजें",
    apiKeyManager: "एपीआई कुंजी प्रबंधक",
    envConfigured: "कॉन्फ़िगर किया गया",
    envMissing: "अनुपस्थित",
    inputPlaceholderKey: "अपनी एपीआई कुंजी पेस्ट करें",
    inputPlaceholderKeySaved: "••••••••••••••••",
    backendActive: "बैकएंड: सक्रिय",
    runPipeline: "पाइपलाइन चलाएं",
    logsConsole: "वास्तविक समय टर्मिनल लॉग",
    btnRunStage: "अगला चरण निष्पादित करें"
  }
};


interface Pipeline {
  name: string;
  version: string;
  description: string;
  category: string;
  stability: string;
  stages: string[];
}

interface Project {
  name: string;
  path: string;
  current_stage: string;
  status: string;
  has_renders: boolean;
}

interface EnvStatus {
  [key: string]: boolean;
}

const API_BASE = "http://localhost:8000";

export default function App() {
  const [language, setLanguage] = useState<"en" | "bn" | "es" | "hi">("en");
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[language][key] || TRANSLATIONS.en[key];

  const [activeTab, setActiveTab] = useState<"projects" | "new" | "settings">("projects");
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [envStatus, setEnvStatus] = useState<EnvStatus>({});
  const [capabilities, setCapabilities] = useState<any>(null);
  const [selectedCapability, setSelectedCapability] = useState<any | null>(null);
  
  // Selection / Workspace state
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectDetail, setProjectDetail] = useState<Project | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Form states
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [projectPrompt, setProjectPrompt] = useState("");
  
  // Key Manager states
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({
    FAL_KEY: "",
    GOOGLE_API_KEY: "",
    ELEVENLABS_API_KEY: "",
    OPENAI_API_KEY: "",
    XAI_API_KEY: "",
    DOUBAO_SPEECH_API_KEY: "",
    SUNO_API_KEY: "",
    HEYGEN_API_KEY: "",
    RUNWAY_API_KEY: "",
    PEXELS_API_KEY: "",
    PIXABAY_API_KEY: "",
    UNSPLASH_ACCESS_KEY: ""
  });

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Initial loads
  useEffect(() => {
    fetchPipelines();
    fetchProjects();
    fetchEnvStatus();
    fetchCapabilities();
  }, []);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // API Calls
  const fetchPipelines = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pipelines`);
      const data = await res.json();
      setPipelines(data);
      if (data.length > 0) setSelectedPipeline(data[0].name);
    } catch (e) {
      console.error("Error fetching pipelines:", e);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/projects`);
      const data = await res.json();
      setProjects(data);
      if (selectedProject) {
        const found = data.find((p: Project) => p.name === selectedProject);
        if (found) setProjectDetail(found);
      }
    } catch (e) {
      console.error("Error fetching projects:", e);
    }
  };

  const fetchEnvStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/env`);
      const data = await res.json();
      setEnvStatus(data);
    } catch (e) {
      console.error("Error fetching env status:", e);
    }
  };

  const fetchCapabilities = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/capabilities`);
      const data = await res.json();
      setCapabilities(data);
    } catch (e) {
      console.error("Error fetching capabilities:", e);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;
    const formattedName = newProjectName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    try {
      const res = await fetch(`${API_BASE}/api/projects/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formattedName,
          pipeline: selectedPipeline,
          prompt: projectPrompt
        })
      });
      if (res.ok) {
        setNewProjectName("");
        setProjectPrompt("");
        await fetchProjects();
        setSelectedProject(formattedName);
        setActiveTab("projects");
        setLogs([`[System] Initialized project "${formattedName}" successfully.`]);
      } else {
        const err = await res.json();
        alert(`Error: ${err.detail}`);
      }
    } catch (e) {
      console.error("Error creating project:", e);
    }
  };

  const handleDeleteProject = async (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMsg = language === "bn"
      ? `আপনি কি নিশ্চিত যে প্রজেক্ট "${name}" চিরতরে মুছে ফেলতে চান? এটি ডিভাইস থেকে পার্মানেন্টলি ডিলিট হবে!`
      : `Are you sure you want to permanently delete project "${name}"? This will delete all files from your device!`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${API_BASE}/api/projects/${name}`, {
        method: "DELETE"
      });
      if (res.ok) {
        if (selectedProject === name) {
          setSelectedProject(null);
          setProjectDetail(null);
        }
        await fetchProjects();
        const successMsg = language === "bn"
          ? `প্রজেক্ট "${name}" সফলভাবে মুছে ফেলা হয়েছে।`
          : `Project "${name}" deleted successfully.`;
        alert(successMsg);
      } else {
        const err = await res.json();
        alert(`Error: ${err.detail}`);
      }
    } catch (e) {
      console.error("Error deleting project:", e);
    }
  };

  const handleUpdateEnv = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/env/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: apiKeys })
      });
      if (res.ok) {
        alert("API keys updated successfully!");
        fetchEnvStatus();
        fetchCapabilities();
        // Clear forms
        setApiKeys(prev => {
          const cleared = { ...prev };
          Object.keys(cleared).forEach(k => cleared[k] = "");
          return cleared;
        });
      }
    } catch (e) {
      console.error("Error updating env:", e);
    }
  };

  const handleRunPipeline = async () => {
    if (!selectedProject || isRunning) return;
    setIsRunning(true);
    setLogs(prev => [...prev, `[System] Starting stage execution for "${selectedProject}"...`]);
    
    // Simulate pipeline run locally
    let interval: any;
    let count = 0;
    const dummyLogs = [
      `[Registry] Discovering capabilities...`,
      `[Preflight] Checking tool dependencies: Passed.`,
      `[Pipeline] Loading manifest for "${projectDetail?.name || ""}"...`,
      `[Idea] Reading stage director skill (skills/pipelines/animated-explainer/mcr-idea-director.md)...`,
      `[Idea] Orchestrating LLM research agent: Searching topic details...`,
      `[Idea] Research brief created successfully at projects/${selectedProject}/artifacts/research_brief.json.`,
      `[Script] Writing video script and dividing timeline scenes...`,
      `[Script] Coherent narration beats and action tags written.`,
      `[Checkpoint] Saving script checkpoint:Completed.`,
      `[Assets] Invoking image generation API: Generating 12 visual stills...`,
      `[Assets] Sourcing ambient background music...`,
      `[Assets] Narrating voiceover track via ElevenLabs TTS...`,
      `[Assets] Slicing voiceover audio and compiling final asset manifest.`,
      `[Compose] Rendering composition timeline using Remotion Composer engine...`,
      `[Compose] Assembly: 24 clips stitched and rendered.`,
      `[Review] Post-render self-review (ffprobe, frame sample, audio levels) passed.`,
      `[System] Production complete! Render report generated. Deliverable available at projects/${selectedProject}/renders/final.mp4.`
    ];

    interval = setInterval(() => {
      if (count < dummyLogs.length) {
        setLogs(prev => [...prev, dummyLogs[count]]);
        count++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
        fetchProjects();
      }
    }, 1500);
  };

  const selectProject = (name: string) => {
    setSelectedProject(name);
    const found = projects.find(p => p.name === name);
    if (found) {
      setProjectDetail(found);
      setLogs([`[System] Switched to workspace of project: "${name}"`]);
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Top Banner */}
      <header className="glass-panel" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        margin: "12px",
        borderRadius: "12px",
        border: "1px solid var(--card-border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/logo.png"
            alt="AeroCut AI Logo"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              objectFit: "cover",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 0 10px rgba(0, 242, 254, 0.4)"
            }}
          />
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: "700", letterSpacing: "-0.5px" }}>
              {t("title")} <span style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", fontWeight: "500" }}>by MCR</span>
            </h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {t("subtitle")}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Language Selector */}
          <select
            value={language}
            onChange={e => setLanguage(e.target.value as any)}
            className="glass-input"
            style={{
              padding: "6px 12px",
              fontSize: "0.75rem",
              borderRadius: "6px",
              width: "auto",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(10,10,20,0.6)",
              color: "#fff",
              outline: "none"
            }}
          >
            <option value="en">🇺🇸 English</option>
            <option value="bn">🇧🇩 বাংলা (Bengali)</option>
            <option value="es">🇪🇸 Español (Spanish)</option>
            <option value="hi">🇮🇳 हिंदी (Hindi)</option>
          </select>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span className="badge badge-success" style={{ padding: "4px 8px", fontSize: "0.7rem" }}>
              {t("backendActive")}
            </span>
          </div>
          {selectedProject && (
            <div className="badge badge-info" style={{ fontSize: "0.7rem" }}>
              Project: {selectedProject}
            </div>
          )}
        </div>
      </header>

      {/* Main Grid */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", padding: "0 12px 12px 12px", gap: "12px" }}>
        
        {/* Left Sidebar Control Panel */}
        <aside className="glass-panel" style={{ width: "350px", display: "flex", flexDirection: "column", padding: "20px", gap: "20px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className={`btn-secondary ${activeTab === "projects" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("projects")}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.85rem",
                borderBottom: activeTab === "projects" ? "2px solid var(--accent-cyan)" : "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <FolderOpen size={16} /> {t("projectsTab")}
            </button>
            <button
              className={`btn-secondary ${activeTab === "new" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("new")}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.85rem",
                borderBottom: activeTab === "new" ? "2px solid var(--accent-cyan)" : "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <PlusCircle size={16} /> {t("newTab")}
            </button>
            <button
              className={`btn-secondary ${activeTab === "settings" ? "active-tab" : ""}`}
              onClick={() => setActiveTab("settings")}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.85rem",
                borderBottom: activeTab === "settings" ? "2px solid var(--accent-cyan)" : "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <Settings size={16} /> {t("keysTab")}
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Tab: Projects list */}
            {activeTab === "projects" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <h3 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: "600" }}>{t("projectsHeader")}</h3>
                {projects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {t("noProjects")}
                  </div>
                ) : (
                  projects.map(proj => (
                    <div
                      key={proj.name}
                      onClick={() => selectProject(proj.name)}
                      className="glass-panel"
                      style={{
                        padding: "12px 14px",
                        cursor: "pointer",
                        borderColor: selectedProject === proj.name ? "var(--accent-cyan)" : "var(--card-border)",
                        background: selectedProject === proj.name ? "rgba(0, 242, 254, 0.05)" : "var(--card-bg)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{proj.name}</span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                          Stage: <span style={{ color: "var(--accent-cyan)", fontWeight: "500" }}>{proj.current_stage}</span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className={`badge ${proj.status === "completed" ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.6rem" }}>
                          {proj.status}
                        </span>
                        <button
                          onClick={(e) => handleDeleteProject(proj.name, e)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: "4px",
                            cursor: "pointer",
                            color: "var(--text-muted)",
                            borderRadius: "4px",
                            transition: "all 0.15s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#f56565";
                            e.currentTarget.style.background = "rgba(245, 101, 101, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "var(--text-muted)";
                            e.currentTarget.style.background = "none";
                          }}
                          title={language === "bn" ? "প্রজেক্টটি ডিলিট করুন" : "Delete Project"}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: New Project Form */}
            {activeTab === "new" && (
              <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: "600" }}>{t("initializePipeline")}</h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("projectNameLabel")}</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="quantum-computing-intro"
                    value={newProjectName}
                    onChange={e => setNewProjectName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("pipelineTemplateLabel")}</label>
                  <select
                    className="glass-input"
                    value={selectedPipeline}
                    onChange={e => setSelectedPipeline(e.target.value)}
                    style={{ background: "#110e21", color: "#fff" }}
                  >
                    {pipelines.map(pipe => (
                      <option key={pipe.name} value={pipe.name}>
                        {pipe.name} ({pipe.stability})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{t("promptLabel")}</label>
                  <textarea
                    className="glass-input"
                    placeholder="Create a 60-second animated trailer about black holes..."
                    rows={4}
                    value={projectPrompt}
                    onChange={e => setProjectPrompt(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "10px" }}>
                  <PlusCircle size={18} /> {t("btnInitialize")}
                </button>
              </form>
            )}

            {/* Tab: Settings / API Keys */}
            {activeTab === "settings" && (
              <form onSubmit={handleUpdateEnv} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontWeight: "600" }}>{t("apiKeyManager")}</h3>
                  <button type="button" onClick={fetchEnvStatus} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent-cyan)" }}>
                    <RefreshCw size={14} />
                  </button>
                </div>

                <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", paddingRight: "4px" }}>
                  {Object.keys(apiKeys).map(key => {
                    const info = API_KEY_INFO[key] || { label: key, url: "#", help: "API key for system service" };
                    return (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#e2e8f0" }}>
                            {info.label}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {info.url !== "#" && (
                              <a
                                href={info.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: "0.65rem",
                                  color: "var(--accent-cyan)",
                                  textDecoration: "underline",
                                  cursor: "pointer"
                                }}
                              >
                                {language === "bn" ? "কী নিন ↗" : language === "es" ? "Obtener clave ↗" : language === "hi" ? "कुंजी प्राप्त करें ↗" : "Get Key ↗"}
                              </a>
                            )}
                            <span style={{
                              fontSize: "0.6rem",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: envStatus[key] ? "rgba(72,187,120,0.15)" : "rgba(245,101,101,0.15)",
                              color: envStatus[key] ? "#48bb78" : "#f56565",
                              border: envStatus[key] ? "1px solid rgba(72,187,120,0.3)" : "1px solid rgba(245,101,101,0.3)"
                            }}>
                              {envStatus[key] 
                                ? (language === "bn" ? "সংযুক্ত" : language === "es" ? "Configurado" : language === "hi" ? "कॉन्फ़िगर" : "Configured")
                                : (language === "bn" ? "অনুপস্থিত" : language === "es" ? "Faltante" : language === "hi" ? "अनुपस्थित" : "Missing")
                              }
                            </span>
                          </div>
                        </div>
                        <input
                          type="password"
                          className="glass-input"
                          placeholder={envStatus[key] ? "••••••••••••••••" : (language === "bn" ? "আপনার এপিআই কী পেস্ট করুন" : language === "es" ? "Pega tu clave API aquí" : language === "hi" ? "अपनी एपीआई कुंजी पेस्ट करें" : "Paste your API key")}
                          value={apiKeys[key]}
                          onChange={e => setApiKeys({ ...apiKeys, [key]: e.target.value })}
                        />
                        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", lineHeight: "1.2" }}>
                          {info.help}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button type="submit" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <Key size={18} /> {t("btnUpdateKeys")}
                </button>
              </form>
            )}

          </div>

          {/* Capabilities rollup card */}
          {capabilities && (
            <div className="glass-panel" style={{ padding: "12px", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                <Cpu size={14} /> Active System Capabilities
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                {(capabilities.capabilities || []).map((v: any, index: number) => (
                  <span
                    key={index}
                    className="badge badge-info"
                    style={{ 
                      fontSize: "0.62rem", 
                      padding: "3px 8px", 
                      cursor: "pointer", 
                      transition: "all 0.15s ease",
                      border: "1px solid rgba(0, 242, 254, 0.15)"
                    }}
                    onClick={() => setSelectedCapability(v)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 0 8px rgba(0, 242, 254, 0.4)';
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.15)';
                    }}
                    title={language === "bn" ? "বিস্তারিত দেখতে ক্লিক করুন" : "Click to view details"}
                  >
                    {index}: {v.configured}/{v.total}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Center / Right Content Panel */}
        <main className="glass-panel" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selectedProject && projectDetail ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
              
              {/* Workspace Header */}
              <div style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--card-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{projectDetail.name}</h2>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    Current Pipeline State: <span style={{ color: "var(--accent-cyan)", fontWeight: "600" }}>{projectDetail.current_stage.toUpperCase()}</span>
                  </p>
                </div>
                
                <div style={{ display: "flex", gap: "10px" }}>
                  <a
                    href={`${API_BASE}/api/projects/${selectedProject}/export`}
                    className="btn-secondary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "0.8rem",
                      padding: "8px 16px",
                      textDecoration: "none"
                    }}
                  >
                    Export ZIP
                  </a>
                  <button
                    onClick={handleRunPipeline}
                    disabled={isRunning}
                    className="btn-primary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      opacity: isRunning ? 0.6 : 1,
                      cursor: isRunning ? "not-allowed" : "pointer"
                    }}
                  >
                    <Play size={16} /> {isRunning ? "Processing..." : "Run Next Stage"}
                  </button>
                </div>
              </div>

              {/* Workspace Flow Nodes */}
              <div style={{
                padding: "16px 24px",
                background: "rgba(0, 0, 0, 0.15)",
                borderBottom: "1px solid var(--card-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                overflowX: "auto",
                gap: "10px"
              }}>
                {STAGES.map((stg, i) => {
                  const isCurrent = projectDetail.current_stage === stg;
                  const isCompleted = STAGES.indexOf(projectDetail.current_stage) > i;
                  return (
                    <React.Fragment key={stg}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: `1px solid ${isCurrent ? "var(--accent-cyan)" : isCompleted ? "rgba(72, 187, 120, 0.4)" : "rgba(255,255,255,0.05)"}`,
                        background: isCurrent ? "rgba(0, 242, 254, 0.1)" : isCompleted ? "rgba(72, 187, 120, 0.05)" : "transparent"
                      }}>
                        {isCompleted ? (
                          <CheckCircle size={14} color="#48bb78" />
                        ) : (
                          <span style={{ fontSize: "0.75rem", fontWeight: "600", color: isCurrent ? "var(--accent-cyan)" : "var(--text-muted)" }}>{i + 1}</span>
                        )}
                        <span style={{
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          color: isCurrent ? "#fff" : isCompleted ? "var(--text-secondary)" : "var(--text-muted)"
                        }}>
                          {stg.replace("_", " ")}
                        </span>
                      </div>
                      {i < STAGES.length - 1 && (
                        <div style={{ flex: 1, height: "1px", background: isCompleted ? "rgba(72, 187, 120, 0.3)" : "rgba(255,255,255,0.06)", minWidth: "15px" }} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Main Workspace Body split panel */}
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                
                {/* Visualizer & Editor (Left side of workspace) */}
                <div style={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", borderRight: "1px solid var(--card-border)" }}>
                  
                  {projectDetail.has_renders ? (
                    <div className="glass-panel" style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                      <h4 style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Eye size={16} /> Final Output Video
                      </h4>
                      <video
                        src={`${API_BASE}/media/projects/${selectedProject}/renders/final.mp4`}
                        controls
                        style={{ width: "100%", borderRadius: "8px", border: "1px solid var(--card-border)", background: "#000" }}
                      />
                      <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                        <a
                          href={`${API_BASE}/media/projects/${selectedProject}/renders/final.mp4`}
                          download={`final.mp4`}
                          className="btn-primary"
                          style={{
                            fontSize: "0.75rem",
                            padding: "8px 12px",
                            textDecoration: "none",
                            textAlign: "center",
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px"
                          }}
                        >
                          Download Video (MP4)
                        </a>
                        <a
                          href={`${API_BASE}/api/projects/${selectedProject}/export`}
                          download={`${selectedProject}_export.zip`}
                          className="btn-secondary"
                          style={{
                            fontSize: "0.75rem",
                            padding: "8px 12px",
                            textDecoration: "none",
                            textAlign: "center",
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: "rgba(255,255,255,0.02)"
                          }}
                        >
                          Export All Assets (ZIP)
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-panel" style={{
                      padding: "40px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "12px",
                      background: "rgba(255,255,255,0.01)"
                    }}>
                      <Layers size={36} color="var(--text-muted)" />
                      <div>
                        <h4 style={{ fontSize: "0.95rem", fontWeight: "600" }}>No renders available yet</h4>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                          Run the pipeline stages to create assets and assemble the final MP4 composition.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Playbook Visual Theme Panel */}
                  <div className="glass-panel" style={{ padding: "16px" }}>
                    <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Sparkles size={16} color="var(--accent-cyan)" /> Visual Playbook Theme
                    </h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                      <div className="glass-panel" style={{ padding: "10px", background: "rgba(255,255,255,0.02)" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Style Template</span>
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", marginTop: "2px" }}>flat-motion-graphics</p>
                      </div>
                      <div className="glass-panel" style={{ padding: "10px", background: "rgba(255,255,255,0.02)" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Resolution Target</span>
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", marginTop: "2px" }}>1920x1080 (16:9)</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Console Log Panel (Right side of workspace) */}
                <div style={{ width: "400px", display: "flex", flexDirection: "column", background: "#06050b" }}>
                  <div style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--card-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Terminal size={14} /> Execution Console logs
                    </span>
                    <button
                      onClick={() => setLogs([])}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.7rem", cursor: "pointer" }}
                    >
                      Clear
                    </button>
                  </div>
                  
                  <div style={{
                    flex: 1,
                    padding: "16px",
                    overflowY: "auto",
                    fontFamily: "monospace",
                    fontSize: "0.75rem",
                    color: "#00ff66",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    lineHeight: "1.4"
                  }}>
                    {logs.map((log, index) => (
                      <div key={index} style={{ wordBreak: "break-all" }}>
                        <span style={{ color: "var(--text-muted)", marginRight: "6px" }}>{`[${new Date().toLocaleTimeString()}]`}</span>
                        {log}
                      </div>
                    ))}
                    <div ref={consoleEndRef} />
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: "16px",
              padding: "40px",
              textAlign: "center"
            }}>
              <Sparkles size={48} color="var(--accent-cyan)" />
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Welcome to AeroCut AI Studio</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", maxWidth: "450px", marginTop: "6px", lineHeight: "1.6" }}>
                  Create or select a video production project from the left panel. Choose a template, outline your brief, and let the agent guide you stage-by-stage to a final high-quality render.
                </p>
              </div>
            </div>
          )}
        </main>

      </div>

      {/* Capability Details Modal */}
      {selectedCapability && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(10, 8, 20, 0.75)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="glass-panel" style={{
            maxWidth: "500px",
            width: "100%",
            padding: "24px",
            border: "1px solid rgba(0, 242, 254, 0.25)",
            boxShadow: "0 0 30px rgba(0, 242, 254, 0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            animation: "modalFadeIn 0.2s ease-out"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={20} style={{ color: "var(--accent-cyan)" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", textTransform: "capitalize", color: "#fff" }}>
                  {selectedCapability.capability.replace(/_/g, ' ')}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedCapability(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  padding: "4px"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <strong>Status:</strong>{" "}
                <span style={{
                  color: selectedCapability.configured > 0 ? "#48bb78" : "#f56565",
                  fontWeight: "600"
                }}>
                  {selectedCapability.configured} of {selectedCapability.total} tools configured
                </span>
              </div>

              {/* Active Providers */}
              <div>
                <h4 style={{ fontSize: "0.8rem", color: "#48bb78", fontWeight: "600", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  ● Active Tools
                </h4>
                {selectedCapability.available_providers.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selectedCapability.available_providers.map((p: string) => (
                      <span key={p} style={{
                        fontSize: "0.7rem",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "rgba(72, 187, 120, 0.1)",
                        color: "#48bb78",
                        border: "1px solid rgba(72, 187, 120, 0.2)"
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>No active tools configured.</p>
                )}
              </div>

              {/* Unavailable Providers */}
              <div>
                <h4 style={{ fontSize: "0.8rem", color: "#f56565", fontWeight: "600", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                  ● Missing/Inactive Tools
                </h4>
                {selectedCapability.unavailable_providers.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {selectedCapability.unavailable_providers.map((p: string) => (
                      <span key={p} style={{
                        fontSize: "0.7rem",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: "rgba(245, 101, 101, 0.1)",
                        color: "#f56565",
                        border: "1px solid rgba(245, 101, 101, 0.2)"
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>All supported tools configured.</p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
              <button 
                onClick={() => setSelectedCapability(null)} 
                className="btn-primary" 
                style={{ padding: "8px 20px", fontSize: "0.8rem", width: "auto" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
