<div align="center">
  <h1>🛡️ Aegis Border Sentinel 🛡️</h1>
  <p><strong>Intelligent Border Surveillance & Tactical Threat Detection System</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/YOLOv8-Large-00FFFF?style=for-the-badge&logo=ultralytics&logoColor=black" alt="YOLOv8" />
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  </p>
</div>

<br />

## 🌟 Overview

**Aegis Border Sentinel** is a cutting-edge, AI-powered border surveillance web platform. Utilizing state-of-the-art neural architecture, it acts as a digital perimeter defense system, analyzing video feeds in real-time to detect, track, and classify tactical threats. 

---

## ✨ Key Features

- 🎯 **Advanced Neural Core (YOLOv8l)**: Precise detection of tactical items (backpacks, cell phones, etc.) even at long distances.
- 🚨 **Signature Recognition Layer**: Smart tactical filters automatically elevate threat levels when identifying `POTENTIAL_COMBATANT` profiles.
- 🌙 **Multi-Spectral Fusion**: 
  - **Night Mode (CLAHE + Gamma)**: Localized contrast enhancement for low-light shadow recovery.
  - **Thermal Fusion**: Simulates FLIR by mapping high-intensity human body heat to warm colors.
- ⚖️ **Weighted Threat Engine**: Multi-factor heuristic calculations (Object Weight, ROI, Scene Context) to score real-time risks.
- 📊 **Real-Time Analytics Dashboard**: Built with React, TailwindCSS, and Chart.js for smooth data visualization.

---

## 🛠️ Tech Stack

### 🎨 Frontend (Client)
- **⚛️ React 18** & **⚡ Vite**
- **💅 TailwindCSS** for rapid UI styling
- **📈 Chart.js** for tactical data visualization
- **🪄 Framer Motion** for fluid animations

### 🧠 Backend (Neural Engine)
- **🐍 Python** backend infrastructure
- **👁️ YOLOv8 (Large)** by Ultralytics for computer vision
- **⚙️ OpenCV** for image processing and multi-spectral fusion simulations

---

## 🚀 Getting Started

### 1️⃣ Prerequisites
- Node.js (v18+)
- Python (3.8+)
- Git

### 2️⃣ Installation & Setup

#### Backend Setup
```bash
cd backend
python -m venv venv
# Activate the virtual environment
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Accessing the Application
Once both servers are running, access the Aegis Sentinel Dashboard at:
👉 **`http://localhost:5173`**

---

## 📡 Verification & Diagnostics
Monitor backend neural engine health directly through the API:
- 🟢 `GET /` - Basic operational status
- 🔍 `GET /diagnostics` - Full architectural and model health
- 🤖 `GET /models` - Neural engine specifications

---

## 🛡️ License

This project is licensed under the MIT License.

<div align="center">
  <sub>Built with ❤️ for advanced security operations.</sub>
</div>
