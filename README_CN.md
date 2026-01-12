# IdeaCyclone (思维风暴) 🌪️

<div align="center">

  <img width="1200" height="475" alt="IdeaCyclone AI Mind Map" src="IdeaCyclone AI Thinking Partner Overview.png" />

  <br/>

  <a href="https://yuho-aigc.lsv.jp/idea/">
    <img src="https://img.shields.io/badge/🚀_在线体验_(Live_Demo)-点击这里-blue?style=for-the-badge&logo=vercel" alt="Live Demo" height="35" />
  </a>

  <br/><br/>

  <img src="https://img.shields.io/badge/React-19.0_RC-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Model-DeepSeek_V3_&_R1-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Model-Gemini_3.0-8E75B2?style=flat-square&logo=google%20gemini&logoColor=white" />

  <h3>不仅仅是思维导图，更是你的 AI 第二大脑。</h3>

  <p>
    基于 <strong>React 19</strong> 和 <strong>Tailwind v4</strong> 构建的现代化 AI 应用。<br/>
    完美支持 <strong>DeepSeek</strong>、<strong>Gemini</strong>、<strong>Kimi</strong> 等主流模型。
  </p>

  [🇺🇸 English Documentation](README.md) | [🐞 提交 Bug](https://github.com/yourname/ideacyclone/issues) | [✨ 功能建议](https://github.com/yourname/ideacyclone/issues)

</div>

---

## 🌟 核心亮点

IdeaCyclone 旨在通过高效的交互和深度的 AI 融合，激发人类的创造力与逻辑思维。这不是一个简单的记录工具，而是一个**主动思考伙伴**。

### 1. 🛠️ 前沿技术栈实战 (React 19 + Tailwind v4)
本项目是一个完全现代化的 Web 开发范例。如果你想学习最新的前端技术，这里有现成的代码：
* **React 19 Ready**: 使用了最新的 Hooks 和 Server Actions 理念。
* **Tailwind v4**: 体验零配置文件的极速样式引擎。

### 2. 🤖 深度 AI 融合与国产模型支持
拒绝“套壳”，我们将 AI 植入到了思考的每一个环节。
* **多专家人格**: 随时切换“逻辑架构师”、“创意总监”、“商业顾问”等角色，让 AI 换个角度帮你思考。
* **概念融合 (Concept Fusion)**: 选中两个毫不相关的节点，让 AI 强制寻找它们之间的内在联系。这是打破思维定势的神器。
* **模型自由**: 除了 GPT-4o 和 Gemini，我们针对**中文语境**深度优化，完美支持 **DeepSeek V3/R1**、**Kimi (Moonshot)**、**智谱 GLM-4** 等国产模型。

### 3. ⚡️ 零摩擦的心流体验
* **智能自动布局**: 告别手动拖拽。基于 D3.js 的力导向算法会在每次扩展后自动整理画布，让你专注于“思考”，而不是“排版”。
* **移动端优先**: 针对触摸屏深度优化，拥有大点击区域和手势支持，随时随地捕捉灵感。

---

## 🧠 支持的模型列表

你可以在设置面板中一键切换模型。

| 提供商 | 模型名称 | 适用场景 | ID |
| :--- | :--- | :--- | :--- |
| **DeepSeek** | DeepSeek R1 / V3 | **推理与中文创作首选** | `deepseek-reasoner` |
| **Google** | Gemini 3.0 / 2.5 Flash | 速度极快，多模态 | `gemini-2.5-flash` |
| **OpenAI** | GPT-4o | 综合能力最强 | `gpt-4o` |
| **Zhipu AI** | GLM-4 Flash | 高性价比中文模型 | `glm-4-flash` |
| **Moonshot** | Moonshot V1 | 长文本与Kimi同款 | `moonshot-v1-8k` |
| **Aliyun** | Qwen Max | 通义千问旗舰版 | `qwen-max` |

---

## 🚀 快速开始

### 环境要求

-   Node.js (v18+)
-   npm 或 yarn 或 pnpm
-   Google Gemini API Key (或 DeepSeek/OpenAI Key)

### 安装步骤

1.  **克隆项目**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/ideacyclone.git](https://github.com/YOUR_USERNAME/ideacyclone.git)
    cd ideacyclone
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置环境变量**
    在根目录创建一个 `.env.local` 文件，填入你的 API Key：
    ```env
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    ```
    *注：你也可以直接在应用的“设置”面板中输入 Key，无需修改代码。*

4.  **本地运行**
    ```bash
    npm run dev
    ```
    打开浏览器访问 `http://localhost:5173` 即可体验。

---

## 🤝 参与贡献

欢迎任何形式的贡献！无论是修复 Bug、完善文档，还是提交一个新的“专家人格”提示词。

1.  Fork 本项目
2.  创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3.  提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4.  推送到分支 (`git push origin feature/AmazingFeature`)
5.  提交 Pull Request

---

## 📄 开源协议

本项目基于 MIT 协议开源。详见 `LICENSE` 文件。

<div align="center">
Built with ❤️ by Yuho | AI & Design 
</div>