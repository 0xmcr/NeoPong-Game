# AeroCut AI by MCR

AeroCut AI by MCR is a production-grade, automated, AI-orchestrated video production studio with an interactive Web UI. It automates the entire pipeline of video creation: research, scriptwriting, voiceover generation, visual asset creation, caption formatting, video compilation, and final rendering.

## 🚀 Key Features

*   **Interactive Web-UI:** Manage projects, select templates, configure API keys, and monitor pipeline progress in real-time.
*   **Multi-Language Interface:** Built-in localization support for English, Bengali (বাংলা), Spanish (Español), and Hindi (हिंदी).
*   **Active AI Capabilities:** Check configured AI engines (OpenAI, Gemini, fal.ai, ElevenLabs, etc.) and explore details of active or missing tool providers.
*   **Dynamic ZIP Export:** Export all generated assets (scripts, voiceovers, visual elements, drafts, final videos) in a single ZIP file at any stage.
*   **Modular Rendering Pipeline:** Driven by a Python FastAPI backend and a React/TypeScript/Vite frontend using Remotion for browser-grade canvas compositions.

---

## 💻 Recommended Hardware & System Configuration

To run AeroCut AI smoothly on your local machine, the following configuration is recommended:

| Specification | Minimum Requirement | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Operating System** | macOS 12+, Linux (Ubuntu/Debian), or Windows 10+ (via WSL2) | macOS 14+ (M-Series) or Linux with GPU | Unix-based systems are preferred for subprocesses |
| **Processor (CPU)** | Intel Core i5 or Apple M1 (4-core) | Apple M2/M3 or Intel Core i7 (8-core+) | Faster CPUs speed up video compilation and transcription |
| **Memory (RAM)** | 8 GB | 16 GB or higher | Multi-stage rendering with Remotion requires decent RAM |
| **Graphics (GPU)** | Integrated Graphics | Dedicated Nvidia GPU or Apple Silicon Unified Memory | Accelerates local image generation if running offline models |
| **Disk Space** | 2 GB | 10 GB+ | Required for stock video clips cache, temp directories, and final output |

---

## 🔧 Prerequisites & System Dependencies

Before installing, you must have the following system utilities installed on your machine:

1.  **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
2.  **Node.js 18+** - [Download Node.js](https://nodejs.org/) (Needed for Remotion video compiler)
3.  **FFmpeg** - Essential for video slicing, audio mixing, and encoding:
    *   **macOS:** `brew install ffmpeg`
    *   **Linux (Ubuntu/Debian):** `sudo apt update && sudo apt install -y ffmpeg`
    *   **Windows:** Install via chocolatey: `choco install ffmpeg` or download binaries from [ffmpeg.org](https://ffmpeg.org/download.html).

---

## ⚙️ Installation & Setup

Follow these simple steps to install and start the application on your device:

### Step 1: Clone the Repository
```bash
git clone https://github.com/maheshwarroy/AeroCut-AI.git
cd AeroCut-AI
```

### Step 2: Set Up Virtual Environment & Dependencies
Create a Python virtual environment and install the required modules:
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Step 3: Install Frontend Packages
Go to the frontend directory and install Node dependencies:
```bash
cd web-ui
npm install
cd ..
```

### Step 4: Configure Environment Variables
Copy the example environment template to create your `.env` configuration file:
```bash
cp .env.example .env
```
*(Open `.env` and fill in your AI provider keys (like `OPENAI_API_KEY`, `FAL_KEY`, etc.), or easily configure them later using the API Key Manager tab in the Web UI!)*

---

## 🚦 How to Run the App

Start the FastAPI backend server (which will automatically serve both the API and the compiled React web interface):
```bash
python3 server/main.py
```

Once started, open your web browser and navigate to:
```text
http://localhost:8000
```

From the dashboard, you can:
1.  Go to the **New** tab to initialize a new video production project by specifying a prompt and selecting a template.
2.  Monitor logs and active execution stages from the console.
3.  Use the **Keys** tab to safely configure and update API keys dynamically.
4.  Export completed project packages using the **Export ZIP** feature.

---

## 🛠️ Tech Stack & Architecture

*   **Backend Framework:** FastAPI (Python 3)
*   **Frontend Library:** React with TypeScript, Vite, and Lucide React
*   **Styling System:** Vanilla Glassmorphic CSS variables
*   **Video Compositor:** Remotion (Server-side headless Chrome rendering)
*   **AI Integration engines:**
    *   **Text/Script:** OpenAI GPT-4o, Google Gemini, xAI
    *   **Voice/TTS:** ElevenLabs, Piper-TTS, Doubao Speech
    *   **Visual Assets/Video:** fal.ai (Kling v3, Flux), Google Imagen, Runway Gen-3
