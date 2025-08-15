<p align="center">
  <img src="https://i.postimg.cc/zvxpmC0D/logo-5.png" alt="Logo" width="120" />
</p>

<h1 align="center">🧠 Resume‑to‑Portfolio Generator (SaaS)</h1>

<p align="center">
  Turn your resume into a fully functional, customizable portfolio website with a single upload — then push it directly to your GitHub. Powered by AI (Ollama), built with React, Express, and MongoDB.
</p>

<p align="center">
  <a href="#-features">
    <img src="https://img.shields.io/badge/Features-Read%20below-informational?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Made%20by-Team%20Musafir-ff69b4?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://i.postimg.cc/kXkK2Y63/Screenshot-2025-08-15-075956.png" alt="Product Screenshot" width="100%" />
</p>

---

## ✨ Tech Stack

<p>
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Styles-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933?logo=node.js&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/API-Express.js-000000?logo=express&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/DB-MongoDB-47A248?logo=mongodb&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-GitHub%20OAuth-181717?logo=github&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tokens-JWT-000000?logo=jsonwebtokens&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Grok-AI-blueviolet?logo=rocket&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/AI-Ollama-000000?logo=ollama&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Validation-Zod-3066BE?logo=typescript&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Uploads-Multer-FF6B6B?logo=npm&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Hosting-Render-46E3B7?logo=render&logoColor=white&labelColor=000000&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Hosting-Vercel-000000?logo=vercel&logoColor=white&labelColor=000000&style=for-the-badge" />
</p>


---

## 🚀 Features

- 🧾 **Resume upload**: PDF/DOCX parsing (skills, experience, projects, education).
- 🔒 **GitHub OAuth** login + **JWT** session.
- 🤖 **AI portfolio generation** using **Ollama** (local LLM) with customizable sections.
- ⬆️ **One‑click GitHub repo** deployment (create repo, commit generated site, push).
- 🌐 **Live preview** with theme switch, sections on/off, and instant edits.
- 🗂️ **Templates**: multiple portfolio presets (cards, timeline, minimal).
- ⚙️ **Config file** (`portfolio.config.json`) for easy overrides.

---

## 🧩 Architecture

```

/ (monorepo or separate)
/client    → React + Vite + Tailwind (SPA)
/server    → Express API, MongoDB, GitHub OAuth, AI orchestration (Ollama)
/templates → Portfolio themes (e.g., nextjs-static, vanilla-tailwind)

````

Key flows:
1) Upload resume → parse → normalized JSON → store in MongoDB.
2) Call Ollama locally → generate site sections/content.
3) Build static site from chosen template → preview → push to GitHub.

---

## 🧪 Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- **Ollama** installed and at least one model pulled (e.g. `llama3`)
- GitHub OAuth App (Client ID/Secret)

### 1) Clone & Install
```bash
# clone
git clone https://github.com/your-org/your-repo.git
cd your-repo

# install deps
cd server && npm i && cd ..
cd client && npm i && cd ..
````

### 2) Environment Variables

Create **`server/.env`**:

```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/resume2portfolio
JWT_SECRET=supersecret
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=yyy
GITHUB_CALLBACK_URL=http://localhost:8080/auth/github/callback
ALLOWED_ORIGIN=http://localhost:5173
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3
> **Note:** Datas provided are dummy for help.
```

Create **`client/.env`**:

```env
VITE_API_BASE=http://localhost:8080
VITE_GITHUB_CLIENT_ID=xxx
```

### 3) Run Services

```bash
# Terminal A → Ollama (ensure a model is pulled)
ollama pull llama3
ollama serve

# Terminal B → server
cd server
npm run dev

# Terminal C → client
cd client
npm run dev
```

Opens: [http://localhost:5173](http://localhost:5173)

---

## 🔐 GitHub OAuth Setup (Quick)

1. Go to **GitHub → Settings → Developer settings → OAuth Apps**.
2. Create new app with:

   * Homepage: `http://localhost:5173`
   * Authorization callback URL: `http://localhost:8080/auth/github/callback`
3. Copy **Client ID** and **Client Secret** into server/client `.env` as above.

---

## 🧰 Scripts

**Server**

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc -p .",
    "start": "node dist/index.js"
  }
}
```

**Client**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## 🖼️ Templates

* **Minimal** (single page, clean typography)
* **Cards** (project cards + skills cloud)
* **Timeline** (experience/education timeline)

Switch via `templates/<name>` or config in UI.

---

## 🚀 Deployment

* **Frontend**: Vercel(static export from client)
* **Backend**: Render 
* **Environment**: Set the same `.env` keys in your hosting provider

> Tip: For Vercel, expose `VITE_API_BASE` pointing to your hosted backend.

---


## 🤝 Contributing

PRs welcome! Please open an issue to discuss larger changes first.

---

## 📜 License

MIT — see `LICENSE` for details.


---
> **Note:** Some important files are not public for security and privacy reasons.

