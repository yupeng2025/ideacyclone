# IdeaCyclone (思维风暴) 🌪️

**Stop staring at a blank page. Clone your genius.**

IdeaClone is a TypeScript-based AI tool designed to help creators, marketers, and developers break through creative blocks. By inputting a single seed concept, IdeaClone uses LLMs to generate divergent variations, expansion strategies, and execution plans in seconds.

### 🚀 Why IdeaClone?
- **Iterate Fast**: Turn 1 idea into 100 variations.
- **Visual Brainstorming**: Mind-map style visualization.
- **Export Ready**: Copy results directly to Notion/Figma.



https://github.com/user-attachments/assets/046a07aa-2b9f-44a1-8058-bf1dcbdb0b30



<div align="center">
<img width="1200" height="475" alt="GHBanner" src="IdeaCyclone AI Thinking Partner Overview.png" />
</div>

<div align="center">

  <a href="https://yuho-aigc.lsv.jp/idea/">
    <img src="https://img.shields.io/badge/Live_Demo-Click_Here-blue?style=for-the-badge&logo=vercel" alt="Live Demo" height="30" />
  </a>
  
</div>


<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat-square&logo=google%20gemini&logoColor=white)

**Not just a mind map, but your AI-powered second brain.**
*不仅仅是一个思维导图工具，它是一个 AI 驱动的第二大脑。*

[English (Concise)](README_EN.md) | [简体中文](#简体中文)

</div>

---

## 🌟 Highlights (核心优势)

IdeaCyclone aims to spark human creativity and logic through deeper AI integration and efficient interaction.
IdeaCyclone 旨在通过更高效的交互和更深度的 AI 融合，激发人类的创造力与逻辑思维。

### 1. 🤖 Deep AI Integration (深度 AI 融合)
Unlike traditional mind mapping tools that are just for recording, IdeaCyclone is an **Active Thinking Partner**.
不同于传统的思维导图工具（仅用于记录），IdeaCyclone 是一个**主动思考伙伴**。

-   **Expert Personas (多专家人格)**: Switch between "Logical Architect", "Creative Director", "Business Consultant", and more. It's not just prompt engineering; it's a shift in thinking models.
-   **Concept Fusion (概念融合)**: A rare feature that forces AI to find intrinsic connections and innovation points between seemingly unrelated nodes. A tool to break mindset fixations.
-   **Strict Localization (严格本地化)**: Deeply optimized for Chinese/Japanese environments to prevent "mixed languages" and ensure a native thinking environment.

### 2. ⚡️ Frictionless UX (零摩擦交互体验)
-   **Smart Auto-Layout (智能自动布局)**: Forget manual dragging. The canvas auto-arranges after every expansion, keeping your thoughts organized so you can focus on "thinking," not "formatting."
-   **Context-Aware (始终在线的上下文)**: Core operations (expand, explain, fuse) are always at your fingertips.
-   **Mobile-First (移动端优先)**: Deeply optimized for touch screens with large tap areas and gesture support.

### 3. 🛡️ Professional Output (专业级输出)
-   **Structured Reports**: AI-generated content is formatted into Markdown with headers and highlights, ready for professional reports.
-   **Multi-format Export**: Support for JSON (backup), Markdown (docs), and PNG/SVG (presentation).

---

## 🚀 Quick Start (极简操作指南)

### Prerequisites

-   Node.js (v18+)
-   npm or yarn or pnpm
-   Google Gemini API Key (or other supported providers like OpenAI, OpenRouter, etc.)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/YOUR_USERNAME/ideacyclone.git
    cd ideacyclone
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory and add your API Key:
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
    *Note: You can also configure API keys directly in the application Settings panel.*

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    Open your browser and visit `http://localhost:5173`.

---

## 🧠 Supported Models (支持的模型)

IdeaCyclone supports a wide range of LLMs through various providers. You can switch models in the **Settings** panel.

| Provider | Model Name | Description | ID |
| :--- | :--- | :--- | :--- |
| **Google** | Gemini 3.0 Flash | Latest flagship model | `gemini-3.0-flash` |
| **Google** | Gemini 2.5 Flash | Standard fast model | `gemini-2.5-flash` |
| **Google** | Gemini 2.5 Flash Lite | Lightweight fast model | `gemini-2.5-flash-lite` |
| **OpenAI** | GPT-4o | High intelligence flagship | `gpt-4o` |
| **OpenAI** | GPT-4o mini | Cost-effective small model | `gpt-4o-mini` |
| **DeepSeek** | DeepSeek V3 | Strong open-weights model | `deepseek-chat` |
| **DeepSeek** | DeepSeek R1 (Reasoner) | Optimized for reasoning | `deepseek-reasoner` |
| **Zhipu AI** | GLM-4 Flash | Fast Chinese/English model | `glm-4-flash` |
| **Moonshot** | Moonshot V1 (8k) | Kimi wrapper | `moonshot-v1-8k` |
| **Aliyun** | Qwen Max | Qwen flagship | `qwen-max` |
| **Groq** | Llama 3.3 70B | Ultra-fast inference | `llama-3.3-70b-versatile` |
| **OpenRouter** | Mistral Devstral 2 | Experimental Mistral model | `mistralai/devstral-2512:free` |
| **OpenRouter** | Xiaomi MiMo V2 | Mobile optimized | `xiaomi/mimo-v2-flash:free` |
| **GitHub** | Llama 4 Scout | GitHub Models service | `Llama-4-Scout-17B-16E-Instruct` |

---

## 📖 Usage Guide (使用指南)

### Step 1: Start (播种灵感)
Type your core topic in the central search box (e.g., "Future Cities", "AI Education") and hit Enter.

### Step 2: Expand (AI 裂变)
1.  Select any node.
2.  Click the **"✨ AI Expand"** button.
3.  The system will generate 6-8 deeply related child nodes based on the current "Expert Persona".

### Step 3: Fuse (概念融合)
1.  **Select multiple nodes** (Cmd/Ctrl + Click on Desktop, Long press/Double tap on Mobile).
2.  Click the **"💡 Concept Fusion"** button.
3.  AI will analyze these nodes and generate a structured innovation proposal.

---

## 🛠️ Tech Stack (技术栈)

-   **Frontend**: React 19, TypeScript, Vite
-   **Styling**: Tailwind CSS v4
-   **Visualization**: D3.js
-   **AI Integration**: Google GenAI SDK
-   **Icons**: Lucide React

---

## 🤝 Contributing (贡献)

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Built with ❤️ by Yuho | AI & Design 
</div>
