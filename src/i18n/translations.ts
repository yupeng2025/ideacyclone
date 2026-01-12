import { Language, PersonaType } from '../types';

/**
 * 翻译资源类型定义
 */
export interface TranslationStrings {
    actions: string;
    generateImage: string;
    imageGenRequiresGoogle: string;
    conceptFusion: string;
    back: string;
    searchPlaceholder: string;
    subtitle: string; // 新增: 副标题本地化
    modes: {
        standard: string;
        creative: string;
        logic: string;
        business: string;
        poetic: string;
    };
    settings: string;
    apiKeyLabel: string;
    apiKeyPlaceholder: string;
    // New Keys
    openRouterKeyLabel: string;
    githubTokenLabel: string;
    groqKeyLabel: string;
    // Chinese Models Keys
    aliyunKeyLabel: string;
    deepseekKeyLabel: string;
    zhipuKeyLabel: string;
    moonshotKeyLabel: string;
    save: string;
    getPlaceholder: (mode: string) => string;
    guide: {
        btn: string;
        title: string;
        step1Title: string;
        step1Desc: string;
        step1Btn: string;
        step2Title: string;
        step2Desc: string;
        disclaimerTitle: string;
        disclaimerText: string;
    };
    // 新增：操作指南
    controls: {
        tab: string;
        mouseTitle: string;
        leftClick: { title: string; desc: string; };
        rightClick: { title: string; desc: string; };
        midClick: { title: string; desc: string; };
        scroll: { title: string; desc: string; };
        boxSelect: { title: string; desc: string; };
    };
    interfaceGuide: {
        tabSetup: string;
        tabLegend: string;
        sections: {
            topBar: string;
            bottomDock: string;
        };
        captions: {
            mode: string;
            lang: string;
            theme: string;
            settings: string;
            guide: string;
            reset: string;
            save: string;
            load: string;
            undo: string;
            redo: string;
            search: string;
            history: string;
            center: string;
            export: string;
            modeDesc: string;
        };
        shortcuts: {
            title: string;
            items: {
                undo: string;
                redo: string;
                search: string;
                delete: string;
            };
        };
    };
    aiSummary: {
        btn: string;
        generating: string;
        title: string;
        copy: string;
        copied: string;
        noNodes: string;
        explanationTitle: string;
    };
    customPrompt: {
        title: string;
        placeholder: string;
        reset: string;
        saved: string;
    };
    exportSvg: string;
    modelSelection: {
        title: string;
        selected: string;
        unselected: string;
        models: {
            gemini3_flash: string;
            gemini25_flash: string;
            gemini25_flash_lite: string;
            gemini25_flash_image: string;
            gpt4o: string;
            gpt4o_mini: string;
            gpt4_turbo: string;
            gpt35_turbo: string;
            mimo_v2_flash: string;
            devstral_2: string;
            llama_4_scout: string;
            llama_33_70b: string;
            // Chinese Models
            qwen_max: string;
            deepseek_v3: string;
            deepseek_r1: string;
            glm_4: string;
            moonshot_k25: string;
        };
    };
    project: {
        new: string;
        save: string;
        load: string;
        resetConfirmTitle: string;
        resetConfirm: string;
        loadError: string;
        cancel: string;
        confirm: string;
    };
    toasts: {
        deleted: (count: number) => string;
        expanded: string;
        expansionFailed: string;
        selectOneImg: string;
        imgGen: string;
        noImg: string;
        imgFail: string;
        switchToImageModel: string;
        selectNodesFusion: string;
        conceptGen: string;
        conceptFail: string;
        exportPng: string;
        exportJson: string;
        exportMd: string;
        exportFail: string;
        focused: string;
        undo: string;
        redo: string;
        langSwitched: (l: string) => string;
        missingKey: string;
        keySaved: string;
        projectSaved: string;
        projectLoaded: string;
        reset: string;
        keyCopied: string;
    };
    // 无障碍标签
    aria: {
        guideBtn: string;
        settingsBtn: string;
        themeToggle: string;
        modeSelector: string;
        langSelector: string;
        resetBtn: string;
        saveBtn: string;
        loadBtn: string;
        undoBtn: string;
        redoBtn: string;
        searchBtn: string;
        historyBtn: string;
        centerBtn: string;
        exportBtn: string;
        closeBtn: string;
        submitBtn: string;
    };
    // 右键菜单
    contextMenu: {
        smartExpand: string;
        deleteKeyword: string;
        explain: string;
    };
}

/**
 * 英语翻译
 */
const en: TranslationStrings = {
    actions: "Actions",
    generateImage: "Generate Image",
    imageGenRequiresGoogle: "Requires Google Gemini API Key",
    conceptFusion: "Concept Fusion",
    back: "Back",
    searchPlaceholder: "Find node...",
    subtitle: "Creative Divergence Tool",
    modes: {
        standard: "Standard",
        creative: "Creative",
        logic: "Logic",
        business: "Business",
        poetic: "Poetic"
    },
    settings: "Settings",
    apiKeyLabel: "API Key",
    apiKeyPlaceholder: "Paste your API key here...",
    openRouterKeyLabel: "OpenRouter Key",
    githubTokenLabel: "GitHub Token",
    groqKeyLabel: "Groq API Key",
    aliyunKeyLabel: "Aliyun Key",
    deepseekKeyLabel: "DeepSeek Key",
    zhipuKeyLabel: "Zhipu (GLM) Key",
    moonshotKeyLabel: "Moonshot (Kimi) Key",
    save: "Save",
    getPlaceholder: (mode: string) => `Brainstorm in ${mode} mode...`,
    guide: {
        btn: "Usage Guide",
        title: "How to Use IdeaCyclone",
        step1Title: "1. Get Free API Key",
        step1Desc: "Visit Google AI Studio to get a free API Key (No credit card required).",
        step1Btn: "Get API Key",
        step2Title: "Configure App",
        step2Desc: "Click the Settings (Gear) icon in the top-right, paste your key, and click Save.",
        disclaimerTitle: "Important Note",
        disclaimerText: "This application is for educational and learning purposes only. Commercial use is strictly prohibited."
    },
    controls: {
        tab: "Controls",
        mouseTitle: "Mouse Interactions",
        leftClick: { title: "Left Click", desc: "Expand node to generate ideas" },
        rightClick: { title: "Right Click", desc: "Show menu (Explain, Expand, Delete)" },
        midClick: { title: "Pan Canvas", desc: "Right/Middle click drag to move view" },
        scroll: { title: "Zoom Canvas", desc: "Mouse wheel to zoom in/out" },
        boxSelect: { title: "Box Select", desc: "Left click drag on blank area to select multiple nodes" }
    },
    interfaceGuide: {
        tabSetup: "Setup",
        tabLegend: "Interface Legend",
        sections: {
            topBar: "Top Controls",
            bottomDock: "Bottom Toolbar"
        },
        captions: {
            mode: "Switch Expert Persona",
            lang: "Switch Language",
            theme: "Toggle Theme",
            settings: "API Settings",
            guide: "Usage Guide",
            reset: "Reset Project",
            save: "Save Project",
            load: "Load Project",
            undo: "Undo",
            redo: "Redo",
            search: "Search Nodes",
            history: "History",
            center: "Center View",
            export: "Export (PNG/JSON/MD)",
            modeDesc: "Standard, Creative, Logic, etc."
        },
        shortcuts: {
            title: "Keyboard Shortcuts",
            items: {
                undo: "Undo",
                redo: "Redo",
                search: "Search Nodes",
                delete: "Delete Selected"
            }
        }
    },
    aiSummary: {
        btn: "AI Summary",
        generating: "Generating summary...",
        title: "Mind Map Summary",
        copy: "Copy",
        copied: "Copied!",
        noNodes: "Add nodes first to generate summary",
        explanationTitle: "Term Explanation"
    },
    customPrompt: {
        title: "Custom Prompt Template",
        placeholder: "Enter your custom prompt here. Use {term} as placeholder.",
        reset: "Reset to Default",
        saved: "Prompt template saved"
    },
    exportSvg: "SVG Exported",
    modelSelection: {
        title: "AI Model",
        selected: "Selected",
        unselected: "",
        models: {
            gemini3_flash: "Gemini 3.0 Flash",
            gemini25_flash: "Gemini 2.5 Flash",
            gemini25_flash_lite: "Gemini 2.5 Flash Lite",
            gemini25_flash_image: "Gemini 2.5 Flash Image 🖼️",
            gpt4o: "GPT-4o",
            gpt4o_mini: "GPT-4o Mini",
            gpt4_turbo: "GPT-4 Turbo",
            gpt35_turbo: "GPT-3.5 Turbo",
            mimo_v2_flash: "MiMo V2 Flash (OpenRouter)",
            devstral_2: "Devstral 2",
            llama_4_scout: "Llama 4 Scout (GitHub)",
            llama_33_70b: "Llama 3.3 70B (Groq)",
            qwen_max: "Qwen Max (Aliyun)",
            deepseek_v3: "DeepSeek V3",
            deepseek_r1: "DeepSeek R1 (Reasoning)",
            glm_4: "GLM-4 (Zhipu)",
            moonshot_k25: "Kimi K2.5 (Moonshot)"
        }
    },
    project: {
        new: "Reset / New",
        save: "Save Project",
        load: "Load Project",
        resetConfirmTitle: "Reset Project?",
        resetConfirm: "Are you sure you want to clear the canvas and start a new project? Unsaved changes will be lost.",
        loadError: "Failed to load project file.",
        cancel: "Cancel",
        confirm: "Confirm Reset"
    },
    toasts: {
        deleted: (count: number) => `Deleted ${count} node(s)`,
        expanded: "Expanded",
        expansionFailed: "AI Expansion Failed",
        selectOneImg: "Select exactly one node for image gen",
        imgGen: "Image generated!",
        noImg: "No image returned",
        imgFail: "Failed to generate image",
        switchToImageModel: "Please switch to 'Gemini 2.5 Flash Image' model for image generation",
        selectNodesFusion: "Select nodes for concept fusion",
        conceptGen: "Concept generated!",
        conceptFail: "Failed to generate concept",
        exportPng: "PNG Exported",
        exportJson: "JSON Exported",
        exportMd: "Markdown Exported",
        exportFail: "Export failed",
        focused: "Focused",
        undo: "Undo",
        redo: "Redo",
        langSwitched: (l: string) => `Language: ${l}`,
        missingKey: "Please set your API Key in Settings",
        keySaved: "API Key saved",
        projectSaved: "Project saved to file",
        projectLoaded: "Project loaded successfully",
        reset: "Canvas reset",
        keyCopied: "API Key copied"
    },
    aria: {
        guideBtn: "Open usage guide",
        settingsBtn: "Open settings",
        themeToggle: "Toggle dark/light theme",
        modeSelector: "Change brainstorm mode",
        langSelector: "Change language",
        resetBtn: "Reset project and clear canvas",
        saveBtn: "Save project to file",
        loadBtn: "Load project from file",
        undoBtn: "Undo last action",
        redoBtn: "Redo last action",
        searchBtn: "Search nodes",
        historyBtn: "View history",
        centerBtn: "Center view",
        exportBtn: "Export options",
        closeBtn: "Close",
        submitBtn: "Submit and generate ideas"
    },
    contextMenu: {
        smartExpand: "Smart Expand",
        deleteKeyword: "Delete Keyword",
        explain: "Explain Term"
    }
};

/**
 * 中文翻译
 */
const zh: TranslationStrings = {
    actions: "操作",
    generateImage: "生成图像",
    imageGenRequiresGoogle: "需要 Google Gemini API Key",
    conceptFusion: "概念融合",
    back: "返回",
    searchPlaceholder: "查找节点...",
    subtitle: "创意发散工具",
    modes: {
        standard: "标准",
        creative: "创意",
        logic: "逻辑",
        business: "商业",
        poetic: "诗意"
    },
    settings: "设置",
    apiKeyLabel: "API 密钥",
    apiKeyPlaceholder: "在此粘贴您的 API Key...",
    openRouterKeyLabel: "OpenRouter 密钥",
    githubTokenLabel: "GitHub Token",
    groqKeyLabel: "Groq API 密钥",
    aliyunKeyLabel: "阿里云 Key",
    deepseekKeyLabel: "DeepSeek Key",
    zhipuKeyLabel: "智谱 (GLM) Key",
    moonshotKeyLabel: "Moonshot (Kimi) Key",
    save: "保存",
    getPlaceholder: (mode: string) => `以${mode}模式进行头脑风暴...`,
    guide: {
        btn: "使用指南",
        title: "IdeaCyclone 使用说明",
        step1Title: "1. 获取免费 API Key",
        step1Desc: "访问 Google AI Studio 申请免费 Key（无需信用卡，部分地区需网络工具）。",
        step1Btn: "去申请 Key",
        step2Title: "配置软件",
        step2Desc: "点击右上角的设置图标（齿轮），粘贴 Key 并选择 AI 模型，然后保存。",
        disclaimerTitle: "注意事项",
        disclaimerText: "本应用仅供学习与技术交流使用，严禁用于任何商业用途。"
    },
    controls: {
        tab: "基本操作",
        mouseTitle: "鼠标交互",
        leftClick: { title: "左键点击", desc: "点击节点进行智能扩展" },
        rightClick: { title: "右键点击", desc: "唤起菜单（解释、扩展、删除）" },
        midClick: { title: "移动画布", desc: "右键或中键按住拖拽平移视图" },
        scroll: { title: "缩放画布", desc: "鼠标滚轮缩放视图" },
        boxSelect: { title: "框选节点", desc: "在空白处按住左键拖拽可框选多个节点" }
    },
    interfaceGuide: {
        tabSetup: "快速开始",
        tabLegend: "界面图例",
        sections: {
            topBar: "顶部控制栏",
            bottomDock: "底部工具栏"
        },
        captions: {
            mode: "切换专家角色",
            lang: "切换语言",
            theme: "切换主题",
            settings: "API 设置",
            guide: "使用指南",
            reset: "重置项目",
            save: "保存项目",
            load: "加载项目",
            undo: "撤销",
            redo: "重做",
            search: "搜索节点",
            history: "历史记录",
            center: "居中视图",
            export: "导出 (PNG/JSON/MD)",
            modeDesc: "标准, 创意, 逻辑, 商业等"
        },
        shortcuts: {
            title: "键盘快捷键",
            items: {
                undo: "撤销",
                redo: "重做",
                search: "搜索节点",
                delete: "删除选中"
            }
        }
    },
    aiSummary: {
        btn: "AI 总结",
        generating: "正在生成摘要...",
        title: "思维导图摘要",
        copy: "复制",
        copied: "已复制！",
        noNodes: "请先添加节点再生成摘要",
        explanationTitle: "名词解释"
    },
    customPrompt: {
        title: "自定义提示词模板",
        placeholder: "在此输入自定义提示词，使用 {term} 作为占位符。",
        reset: "恢复默认",
        saved: "提示词模板已保存"
    },
    exportSvg: "SVG 已导出",
    modelSelection: {
        title: "AI 模型",
        selected: "已选择",
        unselected: "",
        models: {
            gemini3_flash: "Gemini 3.0 Flash",
            gemini25_flash: "Gemini 2.5 Flash",
            gemini25_flash_lite: "Gemini 2.5 Flash Lite",
            gemini25_flash_image: "Gemini 2.5 Flash Image 🖼️ (图像生成)",
            gpt4o: "GPT-4o",
            gpt4o_mini: "GPT-4o Mini",
            gpt4_turbo: "GPT-4 Turbo",
            gpt35_turbo: "GPT-3.5 Turbo",
            mimo_v2_flash: "MiMo V2 Flash (OpenRouter)",
            devstral_2: "Devstral 2",
            llama_4_scout: "Llama 4 Scout (GitHub)",
            llama_33_70b: "Llama 3.3 70B (Groq)",
            qwen_max: "通义千问 Max (阿里云)",
            deepseek_v3: "DeepSeek V3",
            deepseek_r1: "DeepSeek R1 (深度思考)",
            glm_4: "GLM-4 (智谱)",
            moonshot_k25: "Kimi K2.5 (月之暗面)"
        }
    },
    project: {
        new: "重置 / 新建",
        save: "保存项目",
        load: "加载项目",
        resetConfirmTitle: "重置项目？",
        resetConfirm: "确定要清空画布并开始新项目吗？未保存的进度将丢失。",
        loadError: "加载项目文件失败。",
        cancel: "取消",
        confirm: "确认重置"
    },
    toasts: {
        deleted: (count: number) => `已删除 ${count} 个节点`,
        expanded: "已扩展",
        expansionFailed: "AI 扩展失败",
        selectOneImg: "请选择一个节点以生成图像",
        imgGen: "图像已生成！",
        noImg: "未返回图像",
        imgFail: "生成图像失败",
        switchToImageModel: "请切换到 'Gemini 2.5 Flash Image' 模型以生成图像",
        selectNodesFusion: "请选择节点进行概念融合",
        conceptGen: "概念已生成！",
        conceptFail: "生成概念失败",
        exportPng: "PNG 已导出",
        exportJson: "JSON 已导出",
        exportMd: "Markdown 已导出",
        exportFail: "导出失败",
        focused: "已定位",
        undo: "撤销",
        redo: "重做",
        langSwitched: (l: string) => `语言切换: ${l}`,
        missingKey: "请在设置中配置您的 API Key",
        keySaved: "API Key 已保存",
        projectSaved: "项目已保存到本地文件",
        projectLoaded: "项目加载成功",
        reset: "画布已重置",
        keyCopied: "API Key 已复制"
    },
    aria: {
        guideBtn: "打开使用指南",
        settingsBtn: "打开设置",
        themeToggle: "切换深色/浅色主题",
        modeSelector: "切换头脑风暴模式",
        langSelector: "切换语言",
        resetBtn: "重置项目并清空画布",
        saveBtn: "保存项目到文件",
        loadBtn: "从文件加载项目",
        undoBtn: "撤销上一步操作",
        redoBtn: "重做上一步操作",
        searchBtn: "搜索节点",
        historyBtn: "查看历史记录",
        centerBtn: "居中视图",
        exportBtn: "导出选项",
        closeBtn: "关闭",
        submitBtn: "提交并生成创意"
    },
    contextMenu: {
        smartExpand: "智能扩展",
        deleteKeyword: "删除此关键词",
        explain: "解释名词"
    }
};

/**
 * 日语翻译
 */
const ja: TranslationStrings = {
    actions: "アクション",
    generateImage: "画像生成",
    imageGenRequiresGoogle: "Google Gemini API Key が必要",
    conceptFusion: "概念結合",
    back: "戻る",
    searchPlaceholder: "ノード検索...",
    subtitle: "クリエイティブ発散ツール",
    modes: {
        standard: "標準",
        creative: "創造",
        logic: "論理",
        business: "ビジネス",
        poetic: "詩的"
    },
    settings: "設定",
    apiKeyLabel: "APIキー",
    apiKeyPlaceholder: "ここにAPIキーを貼り付けてください...",
    openRouterKeyLabel: "OpenRouterキー",
    githubTokenLabel: "GitHubトークン",
    groqKeyLabel: "Groq APIキー",
    aliyunKeyLabel: "Alibaba Cloudキー",
    deepseekKeyLabel: "DeepSeekキー",
    zhipuKeyLabel: "Zhipu (GLM)キー",
    moonshotKeyLabel: "Moonshot (Kimi)キー",
    save: "保存",
    getPlaceholder: (mode: string) => `${mode}モードで発想中...`,
    guide: {
        btn: "使い方",
        title: "IdeaCyclone 利用ガイド",
        step1Title: "1. 無料APIキーの取得",
        step1Desc: "Google AI Studioにアクセスして無料キーを取得します（クレカ不要）。",
        step1Btn: "キーを取得",
        step2Title: "アプリ設定",
        step2Desc: "右上の設定アイコン（歯車）をクリックし、キーを貼り付けて保存します。",
        disclaimerTitle: "注意事項",
        disclaimerText: "本アプリは学習および技術交流のみを目的としています。商用利用は厳禁です。"
    },
    controls: {
        tab: "基本操作",
        mouseTitle: "マウス操作",
        leftClick: { title: "左クリック", desc: "ノードを展開 / 詳細は右クリック" },
        rightClick: { title: "右クリック", desc: "メニュー表示（解説、拡張、削除）" },
        midClick: { title: "キャンバス移動", desc: "右/中クリックドラッグで移動" },
        scroll: { title: "ズーム", desc: "ホイールで拡大縮小" },
        boxSelect: { title: "範囲選択", desc: "空白部で左ドラッグして複数選択" }
    },
    interfaceGuide: {
        tabSetup: "セットアップ",
        tabLegend: "インターフェース説明",
        sections: {
            topBar: "トップコントロール",
            bottomDock: "ボトムツールバー"
        },
        captions: {
            mode: "専門家切替",
            lang: "言語切替",
            theme: "テーマ切替",
            settings: "API設定",
            guide: "利用ガイド",
            reset: "リセット",
            save: "保存",
            load: "開く",
            undo: "元に戻す",
            redo: "やり直し",
            search: "検索",
            history: "履歴",
            center: "中央に表示",
            export: "エクスポート",
            modeDesc: "標準, 創造, 論理, ビジネスなど"
        },
        shortcuts: {
            title: "キーボードショートカット",
            items: {
                undo: "元に戻す",
                redo: "やり直し",
                search: "ノード検索",
                delete: "選択を削除"
            }
        }
    },
    aiSummary: {
        btn: "AI要約",
        generating: "要約を生成中...",
        title: "マインドマップ要約",
        copy: "コピー",
        copied: "コピーしました！",
        noNodes: "先にノードを追加してから要約を生成してください",
        explanationTitle: "用語解説"
    },
    customPrompt: {
        title: "カスタムプロンプトテンプレート",
        placeholder: "カスタムプロンプトを入力。{term}をプレースホルダーとして使用。",
        reset: "デフォルトに戻す",
        saved: "プロンプトテンプレートを保存しました"
    },
    exportSvg: "SVGをエクスポートしました",
    modelSelection: {
        title: "AIモデル",
        selected: "選択中",
        unselected: "",
        models: {
            gemini3_flash: "Gemini 3.0 Flash",
            gemini25_flash: "Gemini 2.5 Flash",
            gemini25_flash_lite: "Gemini 2.5 Flash Lite",
            gemini25_flash_image: "Gemini 2.5 Flash Image 🖼️ (画像生成)",
            gpt4o: "GPT-4o",
            gpt4o_mini: "GPT-4o Mini",
            gpt4_turbo: "GPT-4 Turbo",
            gpt35_turbo: "GPT-3.5 Turbo",
            mimo_v2_flash: "MiMo V2 Flash (OpenRouter)",
            devstral_2: "Devstral 2",
            llama_4_scout: "Llama 4 Scout (GitHub)",
            llama_33_70b: "Llama 3.3 70B (Groq)",
            qwen_max: "Qwen Max (Aliyun)",
            deepseek_v3: "DeepSeek V3",
            deepseek_r1: "DeepSeek R1 (Reasoning)",
            glm_4: "GLM-4 (Zhipu)",
            moonshot_k25: "Kimi K2.5 (Moonshot)"
        }
    },
    project: {
        new: "リセット / 新規",
        save: "保存",
        load: "開く",
        resetConfirmTitle: "プロジェクトをリセット？",
        resetConfirm: "キャンバスをクリアして新しいプロジェクトを開始しますか？未保存の変更は失われます。",
        loadError: "プロジェクトファイルの読み込みに失敗しました。",
        cancel: "キャンセル",
        confirm: "リセット"
    },
    toasts: {
        deleted: (count: number) => `${count} 個のノードを削除しました`,
        expanded: "展開しました",
        expansionFailed: "AI展開に失敗しました",
        selectOneImg: "画像生成にはノードを1つ選択してください",
        imgGen: "画像が生成されました！",
        noImg: "画像が返されませんでした",
        imgFail: "画像の生成に失敗しました",
        switchToImageModel: "'Gemini 2.5 Flash Image' モデルに切り替えてください",
        selectNodesFusion: "概念結合のためにノードを選択してください",
        conceptGen: "コンセプトが生成されました！",
        conceptFail: "コンセプトの生成に失敗しました",
        exportPng: "PNG をエクスポートしました",
        exportJson: "JSON をエクスポートしました",
        exportMd: "Markdown をエクスポートしました",
        exportFail: "エクスポートに失敗しました",
        focused: "フォーカスしました",
        undo: "元に戻す",
        redo: "やり直し",
        langSwitched: (l: string) => `言語: ${l}`,
        missingKey: "設定でAPIキーを設定してください",
        keySaved: "APIキーを保存しました",
        projectSaved: "プロジェクトをファイルに保存しました",
        projectLoaded: "プロジェクトを読み込みました",
        reset: "キャンバスをリセットしました",
        keyCopied: "APIキーをコピーしました"
    },
    aria: {
        guideBtn: "使用ガイドを開く",
        settingsBtn: "設定を開く",
        themeToggle: "ダーク/ライトテーマを切り替える",
        modeSelector: "ブレインストームモードを変更",
        langSelector: "言語を変更",
        resetBtn: "プロジェクトをリセットしてキャンバスをクリア",
        saveBtn: "プロジェクトをファイルに保存",
        loadBtn: "ファイルからプロジェクトを読み込む",
        undoBtn: "最後の操作を元に戻す",
        redoBtn: "最後の操作をやり直す",
        searchBtn: "ノードを検索",
        historyBtn: "履歴を表示",
        centerBtn: "ビューを中央に",
        exportBtn: "エクスポートオプション",
        closeBtn: "閉じる",
        submitBtn: "送信してアイデアを生成"
    },
    contextMenu: {
        smartExpand: "AI展開",
        deleteKeyword: "キーワードを削除",
        explain: "用語解説"
    }
};

/**
 * 所有翻译资源
 */
export const TRANSLATIONS: Record<Language, TranslationStrings> = {
    en,
    zh,
    ja
};

/**
 * 获取指定语言的翻译
 * @param language 语言代码
 * @returns 翻译资源对象
 */
export const getTranslation = (language: Language): TranslationStrings => {
    return TRANSLATIONS[language] || TRANSLATIONS.en;
};
