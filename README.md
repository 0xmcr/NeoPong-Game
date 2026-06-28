<p align="center">
  <img src="web-ui/public/logo.png" alt="AeroCut AI by MCR" width="120">
</p>

<h1 align="center">AeroCut AI by MCR</h1>

<p align="center"><strong>The Premium AI-Orchestrated Video Production Studio</strong></p>

<p align="center">
  <a href="#-quick-start--english"><img src="https://img.shields.io/badge/Quick%20Start-English-blue?style=for-the-badge" alt="English"></a>
  <a href="#-দ্রুত-শুরু--বাংলা"><img src="https://img.shields.io/badge/দ্রুত%20শুরু-বাংলা-green?style=for-the-badge" alt="Bengali"></a>
  <a href="#-inicio-rápido--español"><img src="https://img.shields.io/badge/Inicio%20Rápido-Español-red?style=for-the-badge" alt="Español"></a>
  <a href="#-त्वरित-शुरुआत--हिंदी"><img src="https://img.shields.io/badge/त्वरित%20शुरुआत-हिंदी-orange?style=for-the-badge" alt="Hindi"></a>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-AGPLv3-blue.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/python-3.10+-yellow.svg" alt="Python">
  <img src="https://img.shields.io/badge/node-18+-green.svg" alt="Node.js">
  <img src="https://img.shields.io/badge/FastAPI-backend-teal.svg" alt="FastAPI">
  <img src="https://img.shields.io/badge/React-frontend-cyan.svg" alt="React">
</p>

---

AeroCut AI is a fully self-hosted, production-grade AI video production studio with an interactive Web UI. It automates the entire video creation pipeline — research, scripting, voiceover, visual asset generation, captioning, and final Remotion rendering — with zero manual editing required.

---

## 🚀 Key Features

- 🎬 **End-to-End Video Pipelines** — 13 production-grade templates (cinematic, animation, talking-head, podcast, documentary, and more)
- 🌐 **Web Dashboard** — Manage projects, run stages, monitor logs, and download outputs from a sleek glassmorphic UI
- 🌍 **Multi-Language UI** — English, বাংলা, Español, हिंदी — switch language live in the dashboard
- 🔑 **API Key Manager** — Configure all AI provider keys directly from the browser with direct "Get Key ↗" links
- 📦 **One-Click Export** — Download final MP4 or export all assets as ZIP from the dashboard
- 🔍 **Capability Inspector** — See which AI tools are active/missing and explore provider details per capability
- 🗑️ **Project Management** — Create, monitor, and permanently delete projects directly from the UI

---

## 💻 Hardware Requirements

| Spec | Minimum | Recommended |
|:---|:---|:---|
| **OS** | macOS 12+, Ubuntu 20.04+, Windows 10 (WSL2) | macOS 14+ M-Series or Ubuntu 22+ with GPU |
| **CPU** | 4-core (Intel i5 / Apple M1) | 8-core+ (Intel i7 / Apple M2/M3) |
| **RAM** | 8 GB | 16 GB+ |
| **GPU** | Integrated | Nvidia CUDA GPU or Apple Silicon |
| **Disk** | 2 GB free | 10 GB+ (for renders, cache) |

---

---

## 🇺🇸 Quick Start — English

### Prerequisites
- **Python 3.10+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **FFmpeg**:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt update && sudo apt install -y ffmpeg`
  - Windows: `choco install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org/download.html)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/0xmcr/AeroCut-AI.git
cd AeroCut-AI

# 2. Create Python virtual environment
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Install frontend packages
cd web-ui && npm install && cd ..

# 5. Set up environment variables
cp .env.example .env
# Edit .env and add your AI provider API keys
# Or configure them later from the Web UI → Keys tab
```

### Run the App

```bash
python3 server/main.py
```

Open your browser at **http://localhost:8000**

---

---

## 🇧🇩 দ্রুত শুরু — বাংলা

### প্রয়োজনীয় সফটওয়্যার
- **Python 3.10+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **FFmpeg** ইন্সটল করুন:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt update && sudo apt install -y ffmpeg`
  - Windows: `choco install ffmpeg`

### ইন্সটলেশন

```bash
# ১. রিপোজিটরি ক্লোন করুন
git clone https://github.com/0xmcr/AeroCut-AI.git
cd AeroCut-AI

# ২. পাইথন ভার্চুয়াল এনভায়রনমেন্ট তৈরি করুন
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# ৩. পাইথন ডিপেন্ডেন্সি ইন্সটল করুন
pip install -r requirements.txt

# ৪. ফ্রন্টএন্ড প্যাকেজ ইন্সটল করুন
cd web-ui && npm install && cd ..

# ৫. এনভায়রনমেন্ট ভেরিয়েবল সেট করুন
cp .env.example .env
# .env ফাইলে আপনার AI প্রোভাইডার API কী যোগ করুন
# অথবা পরে Web UI → Keys ট্যাব থেকে সহজেই কনফিগার করুন
```

### অ্যাপ চালু করুন

```bash
python3 server/main.py
```

আপনার ব্রাউজারে যান: **http://localhost:8000**

> **ড্যাশবোর্ড ব্যবহার করুন:**
> - **Projects** ট্যাব: আপনার সমস্ত প্রজেক্ট দেখুন ও ম্যানেজ করুন
> - **New** ট্যাব: নতুন ভিডিও প্রজেক্ট শুরু করুন (টেমপ্লেট ও প্রম্পট দিয়ে)
> - **Keys** ট্যাব: AI সার্ভিসের API কী ইনপুট করুন

---

---

## 🇪🇸 Inicio Rápido — Español

### Requisitos previos
- **Python 3.10+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **FFmpeg**:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt update && sudo apt install -y ffmpeg`
  - Windows: `choco install ffmpeg`

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/0xmcr/AeroCut-AI.git
cd AeroCut-AI

# 2. Crear entorno virtual de Python
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Instalar dependencias de Python
pip install -r requirements.txt

# 4. Instalar paquetes del frontend
cd web-ui && npm install && cd ..

# 5. Configurar variables de entorno
cp .env.example .env
# Edita .env y agrega tus claves API de proveedores de IA
# O configúralas luego desde la interfaz web → pestaña Keys
```

### Iniciar la aplicación

```bash
python3 server/main.py
```

Abre tu navegador en **http://localhost:8000**

---

---

## 🇮🇳 त्वरित शुरुआत — हिंदी

### आवश्यक सॉफ़्टवेयर
- **Python 3.10+** → [python.org](https://www.python.org/downloads/)
- **Node.js 18+** → [nodejs.org](https://nodejs.org/)
- **FFmpeg** इंस्टॉल करें:
  - macOS: `brew install ffmpeg`
  - Ubuntu/Debian: `sudo apt update && sudo apt install -y ffmpeg`
  - Windows: `choco install ffmpeg`

### इंस्टॉलेशन

```bash
# 1. रिपॉजिटरी क्लोन करें
git clone https://github.com/0xmcr/AeroCut-AI.git
cd AeroCut-AI

# 2. Python वर्चुअल एनवायरनमेंट बनाएं
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 3. Python डिपेंडेंसीज़ इंस्टॉल करें
pip install -r requirements.txt

# 4. फ्रंटएंड पैकेज इंस्टॉल करें
cd web-ui && npm install && cd ..

# 5. एनवायरनमेंट वेरिएबल सेट करें
cp .env.example .env
# .env फ़ाइल में अपने AI प्रोवाइडर API कुंजियाँ जोड़ें
# या बाद में Web UI → Keys टैब से कॉन्फ़िगर करें
```

### ऐप चलाएं

```bash
python3 server/main.py
```

अपने ब्राउज़र में खोलें: **http://localhost:8000**

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---|:---|
| **Backend** | FastAPI (Python 3) |
| **Frontend** | React + TypeScript + Vite |
| **Styling** | Vanilla CSS (Glassmorphic) |
| **Video Rendering** | Remotion (headless Chromium) |
| **Text / Script AI** | OpenAI GPT-4o, Google Gemini, xAI |
| **Voice / TTS** | ElevenLabs, Piper-TTS, Doubao Speech |
| **Image / Video AI** | fal.ai (Kling, Flux), Google Imagen, Runway Gen-3 |

---

## 📄 License

This project is licensed under the **AGPLv3 License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting pull requests and reporting issues.

---

## 🔒 Security

See [SECURITY.md](SECURITY.md) for details on how to responsibly disclose vulnerabilities.
