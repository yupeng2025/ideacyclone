import React, { useRef, useState, useEffect } from 'react';
import { Settings, Key, X, Eye, EyeOff, Copy, Check, ChevronDown, Sparkles, Monitor, Cpu, Globe, Zap, ShieldCheck, CreditCard } from 'lucide-react';
import { TranslationStrings } from '../../i18n';
import { useClickOutside } from '../../hooks';

// 支持的 AI 模型列表
export type AIProvider = 'google' | 'openai' | 'openrouter' | 'github' | 'groq' | 'aliyun' | 'deepseek' | 'zhipu' | 'moonshot';

export const AI_MODELS = [
    // Google - Gemini 3.0 Flash (最新旗舰模型)
    { id: 'gemini-3.0-flash', name: 'gemini3_flash', free: false, provider: 'google' as AIProvider },
    // Google - Gemini 2.5 Flash (主力模型)
    { id: 'gemini-2.5-flash', name: 'gemini25_flash', free: true, provider: 'google' as AIProvider },
    // Google - Gemini 2.5 Flash Lite (轻量版)
    { id: 'gemini-2.5-flash-lite', name: 'gemini25_flash_lite', free: true, provider: 'google' as AIProvider },
    // Google - Gemini 2.5 Flash Image (图像生成)
    { id: 'gemini-2.5-flash-image-preview', name: 'gemini25_flash_image', free: true, provider: 'google' as AIProvider },

    // OpenAI - GPT
    { id: 'gpt-4o', name: 'gpt4o', free: false, provider: 'openai' as AIProvider },
    { id: 'gpt-4o-mini', name: 'gpt4o_mini', free: false, provider: 'openai' as AIProvider },

    // OpenRouter - 小米 MiMo
    { id: 'xiaomi/mimo-v2-flash:free', name: 'mimo_v2_flash', free: true, provider: 'openrouter' as AIProvider },
    // OpenRouter - Mistral Devstral 2
    { id: 'mistralai/devstral-2512:free', name: 'devstral_2', free: true, provider: 'openrouter' as AIProvider },
    // GitHub Models (更新为正确的模型ID)
    { id: 'Llama-4-Scout-17B-16E-Instruct', name: 'llama_4_scout', free: true, provider: 'github' as AIProvider },
    // Groq Cloud
    { id: 'llama-3.3-70b-versatile', name: 'llama_33_70b', free: false, provider: 'groq' as AIProvider },
    // Aliyun (Qwen)
    { id: 'qwen-max', name: 'qwen_max', free: false, provider: 'aliyun' as AIProvider },
    // DeepSeek
    { id: 'deepseek-chat', name: 'deepseek_v3', free: false, provider: 'deepseek' as AIProvider },
    { id: 'deepseek-reasoner', name: 'deepseek_r1', free: false, provider: 'deepseek' as AIProvider },
    // Zhipu AI (GLM) - 更新为更快的 flash 版本
    { id: 'glm-4-flash', name: 'glm_4', free: false, provider: 'zhipu' as AIProvider },
    // Moonshot (Kimi)
    { id: 'moonshot-v1-8k', name: 'moonshot_k25', free: false, provider: 'moonshot' as AIProvider }
] as const;

export type AIModelId = typeof AI_MODELS[number]['id'];

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    t: TranslationStrings;
    apiKey: string;
    onSaveApiKey: (key: string) => void;
    onCopyKey: () => void;
    isKeyCopied: boolean;
    selectedModel: AIModelId;
    onModelChange: (model: AIModelId) => void;
    // OpenAI API Key
    openaiKey: string;
    onSaveOpenaiKey: (key: string) => void;
    // OpenRouter Key
    openRouterKey: string;
    onSaveOpenRouterKey: (key: string) => void;
    // GitHub Token
    githubToken: string;
    onSaveGithubToken: (key: string) => void;
    // Groq Key
    groqKey: string;
    onSaveGroqKey: (key: string) => void;
    // Aliyun Key
    aliyunKey: string;
    onSaveAliyunKey: (key: string) => void;
    // DeepSeek Key
    deepseekKey: string;
    onSaveDeepseekKey: (key: string) => void;
    // Zhipu Key
    zhipuKey: string;
    onSaveZhipuKey: (key: string) => void;
    // Moonshot Key
    moonshotKey: string;
    onSaveMoonshotKey: (key: string) => void;
    // 保存完成回调
    onSaveComplete?: () => void;
}

// 提取通用的KeyInput组件以减少重复代码并统一风格
interface KeyInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    onClear: () => void;
    isVisible: boolean;
    onToggleVisibility: () => void;
    onCopy?: () => void;
    isCopied?: boolean;
    t: TranslationStrings;
    isDarkMode: boolean;
    providerColorClass: string; // e.g. "text-blue-500"
}

const KeyInput: React.FC<KeyInputProps> = ({
    id, label, value, onChange, placeholder, onClear, isVisible, onToggleVisibility, onCopy, isCopied, t, isDarkMode, providerColorClass
}) => {
    return (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
            <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-[11px] font-bold opacity-60 uppercase tracking-widest pl-1">
                    {label}
                </label>
                {value && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                        <span className="text-[10px] font-bold text-cyan-400 tracking-wide">CONFIGURED</span>
                    </div>
                )}
            </div>

            <div className="relative group">
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500`} />
                <div className={`absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center z-10 transition-colors duration-300 ${value ? 'text-cyan-400' : 'opacity-30'}`}>
                    <Key className="w-4 h-4" aria-hidden="true" />
                </div>

                <input
                    id={id}
                    type={isVisible ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-xl pl-10 pr-24 py-3 text-xs font-mono tracking-wide focus:outline-none focus:ring-1 transition-all duration-300 ${isDarkMode
                        ? 'bg-black/40 border border-white/10 focus:border-white/20 focus:ring-white/10 text-gray-200 placeholder-gray-600'
                        : 'bg-gray-100/50 border border-gray-200 focus:border-gray-300 focus:ring-gray-200 text-gray-800'
                        }`}
                    autoComplete="off"
                    spellCheck="false"
                />

                {/* Actions */}
                <div className="absolute right-2 top-2 bottom-2 flex items-center gap-1">
                    {value && (
                        <>
                            <div className="h-4 w-[1px] bg-white/10 mx-1" />
                            <button
                                onClick={onClear}
                                type="button"
                                className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg text-gray-500 transition-all duration-200 group/btn"
                                aria-label="Clear API key"
                            >
                                <X className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={onToggleVisibility}
                                type="button"
                                className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg text-gray-500 transition-all duration-200 group/btn"
                                aria-label={isVisible ? "Hide API key" : "Show API key"}
                            >
                                {isVisible
                                    ? <EyeOff className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                    : <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                }
                            </button>
                            {onCopy && (
                                <button
                                    onClick={onCopy}
                                    type="button"
                                    className="p-1.5 hover:bg-white/10 hover:text-white rounded-lg text-gray-500 transition-all duration-200 group/btn"
                                    aria-label="Copy API key"
                                >
                                    {isCopied
                                        ? <Check className="w-3.5 h-3.5 text-cyan-400" />
                                        : <Copy className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                                    }
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * 设置面板组件 - 重构版
 * 视觉风格：高级暗黑玻璃态 (Premium Dark Glassmorphism)
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    isOpen,
    onClose,
    isDarkMode,
    t,
    apiKey,
    onSaveApiKey,
    onCopyKey,
    isKeyCopied,
    selectedModel,
    onModelChange,
    openaiKey,
    onSaveOpenaiKey,
    openRouterKey,
    onSaveOpenRouterKey,
    githubToken,
    onSaveGithubToken,
    groqKey,
    onSaveGroqKey,
    aliyunKey,
    onSaveAliyunKey,
    deepseekKey,
    onSaveDeepseekKey,
    zhipuKey,
    onSaveZhipuKey,
    moonshotKey,
    onSaveMoonshotKey,
    onSaveComplete
}) => {
    const panelRef = useRef<HTMLDivElement>(null);

    // Internal state for keys
    const [localKey, setLocalKey] = useState(apiKey);
    const [localOpenaiKey, setLocalOpenaiKey] = useState(openaiKey);
    const [localOpenRouterKey, setLocalOpenRouterKey] = useState(openRouterKey);
    const [localGithubToken, setLocalGithubToken] = useState(githubToken);
    const [localGroqKey, setLocalGroqKey] = useState(groqKey);
    const [localAliyunKey, setLocalAliyunKey] = useState(aliyunKey);
    const [localDeepseekKey, setLocalDeepseekKey] = useState(deepseekKey);
    const [localZhipuKey, setLocalZhipuKey] = useState(zhipuKey);
    const [localMoonshotKey, setLocalMoonshotKey] = useState(moonshotKey);

    // Visibility states
    const [visibilities, setVisibilities] = useState<Record<string, boolean>>({});
    const toggleVisibility = (key: string) => {
        setVisibilities(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

    // Sync props to state
    useEffect(() => { setLocalKey(apiKey); }, [apiKey]);
    useEffect(() => { setLocalOpenaiKey(openaiKey); }, [openaiKey]);
    useEffect(() => { setLocalOpenRouterKey(openRouterKey); }, [openRouterKey]);
    useEffect(() => { setLocalGithubToken(githubToken); }, [githubToken]);
    useEffect(() => { setLocalGroqKey(groqKey); }, [groqKey]);
    useEffect(() => { setLocalAliyunKey(aliyunKey); }, [aliyunKey]);
    useEffect(() => { setLocalDeepseekKey(deepseekKey); }, [deepseekKey]);
    useEffect(() => { setLocalZhipuKey(zhipuKey); }, [zhipuKey]);
    useEffect(() => { setLocalMoonshotKey(moonshotKey); }, [moonshotKey]);

    useEffect(() => {
        if (isOpen) setIsModelDropdownOpen(false);
    }, [isOpen]);

    useClickOutside(panelRef, onClose, isOpen);

    const currentProvider = AI_MODELS.find(m => m.id === selectedModel)?.provider || 'google';

    const handleSave = () => {
        onSaveApiKey(localKey);
        onSaveOpenaiKey(localOpenaiKey);
        onSaveOpenRouterKey(localOpenRouterKey);
        onSaveGithubToken(localGithubToken);
        onSaveGroqKey(localGroqKey);
        onSaveAliyunKey(localAliyunKey);
        onSaveDeepseekKey(localDeepseekKey);
        onSaveZhipuKey(localZhipuKey);
        onSaveMoonshotKey(localMoonshotKey);

        onSaveComplete?.();
        onClose();
    };

    const handleClearCurrentKey = () => {
        switch (currentProvider) {
            case 'google': setLocalKey(''); break;
            case 'openai': setLocalOpenaiKey(''); break;
            case 'openrouter': setLocalOpenRouterKey(''); break;
            case 'github': setLocalGithubToken(''); break;
            case 'groq': setLocalGroqKey(''); break;
            case 'aliyun': setLocalAliyunKey(''); break;
            case 'deepseek': setLocalDeepseekKey(''); break;
            case 'zhipu': setLocalZhipuKey(''); break;
            case 'moonshot': setLocalMoonshotKey(''); break;
        }
    };

    if (!isOpen) return null;

    // Helper to get logic for current provider
    const getProviderConfig = () => {
        switch (currentProvider) {
            case 'google': return {
                key: localKey, setKey: setLocalKey,
                label: t.apiKeyLabel, placeholder: t.apiKeyPlaceholder,
                color: 'text-cyan-400',
                id: 'google', copy: onCopyKey, copied: isKeyCopied
            };
            case 'openai': return {
                key: localOpenaiKey, setKey: setLocalOpenaiKey,
                label: 'OpenAI API Key', placeholder: 'sk-...',
                color: 'text-cyan-400', id: 'openai'
            };
            case 'openrouter': return {
                key: localOpenRouterKey, setKey: setLocalOpenRouterKey,
                label: t.openRouterKeyLabel, placeholder: 'sk-or-...',
                color: 'text-cyan-400', id: 'openrouter'
            };
            case 'github': return {
                key: localGithubToken, setKey: setLocalGithubToken,
                label: t.githubTokenLabel, placeholder: 'ghp_...',
                color: 'text-cyan-400', id: 'github'
            };
            case 'groq': return {
                key: localGroqKey, setKey: setLocalGroqKey,
                label: t.groqKeyLabel, placeholder: 'gsk_...',
                color: 'text-cyan-400', id: 'groq'
            };
            case 'aliyun': return {
                key: localAliyunKey, setKey: setLocalAliyunKey,
                label: t.aliyunKeyLabel, placeholder: 'sk-...',
                color: 'text-cyan-400', id: 'aliyun'
            };
            case 'deepseek': return {
                key: localDeepseekKey, setKey: setLocalDeepseekKey,
                label: t.deepseekKeyLabel, placeholder: 'sk-...',
                color: 'text-cyan-400', id: 'deepseek'
            };
            case 'zhipu': return {
                key: localZhipuKey, setKey: setLocalZhipuKey,
                label: t.zhipuKeyLabel, placeholder: 'Run...Key',
                color: 'text-cyan-400', id: 'zhipu'
            };
            case 'moonshot': return {
                key: localMoonshotKey, setKey: setLocalMoonshotKey,
                label: t.moonshotKeyLabel, placeholder: 'sk-...',
                color: 'text-cyan-400', id: 'moonshot'
            };
            default: return null;
        }
    };

    const activeConfig = getProviderConfig();

    return (
        <div
            ref={panelRef}
            className={`pointer-events-auto absolute top-20 md:top-24 right-2 md:right-6 w-[360px] rounded-[24px] shadow-2xl backdrop-blur-2xl animate-in fade-in slide-in-from-top-4 duration-300 z-50 overflow-hidden ${isDarkMode
                ? 'bg-[#0f1117]/90 border border-white/5 shadow-black/50 text-gray-200'
                : 'bg-white/90 border border-black/5 shadow-black/10 text-gray-800'
                }`}
            role="dialog"
            aria-labelledby="settings-panel-title"
        >
            {/* 顶部高光条 */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Title Bar */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${isDarkMode ? 'from-white/10 to-white/5' : 'from-black/5 to-black/0'} border border-white/10 shadow-inner`}>
                        <Settings className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 id="settings-panel-title" className="font-bold text-base tracking-tight text-white/90">
                            {t.settings}
                        </h2>
                        <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                            Configuration
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-all duration-200"
                    aria-label={t.aria.closeBtn}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Area */}
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="px-6 pb-6 space-y-6">

                {/* Model Selection */}
                <div className="space-y-2">
                    <label className="text-[11px] font-bold opacity-60 uppercase tracking-widest pl-1">
                        {t.modelSelection.title}
                    </label>
                    <div className="relative z-20">
                        <button
                            type="button"
                            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                            className={`w-full flex items-center justify-between p-1 pr-3 rounded-xl border transition-all duration-200 group ${isDarkMode
                                ? `bg-black/40 border-white/10 hover:border-white/20 hover:bg-black/50 ${isModelDropdownOpen ? 'ring-2 ring-white/10' : ''}`
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`p-2.5 rounded-lg ${isDarkMode ? 'bg-white/5 group-hover:bg-white/10' : 'bg-black/5'} transition-colors`}>
                                    <Sparkles className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div className="flex flex-col items-start truncate">
                                    <span className="text-xs font-bold text-white/90">
                                        {t.modelSelection.models[AI_MODELS.find(m => m.id === selectedModel)?.name || 'gemma3_12b']}
                                    </span>
                                    <span className="text-[10px] text-white/40 truncate w-full text-left">
                                        {selectedModel}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pl-2">
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                    {t.modelSelection.selected}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-300 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>
                        </button>

                        {/* Custom Dropdown */}
                        {isModelDropdownOpen && (
                            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl overflow-hidden max-h-[320px] overflow-y-auto backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent ${isDarkMode ? 'bg-[#151b26] border-white/10' : 'bg-white border-gray-200'
                                }`}>
                                <div className="p-1 space-y-0.5">
                                    {AI_MODELS.map(model => (
                                        <button
                                            key={model.id}
                                            type="button"
                                            onClick={() => {
                                                onModelChange(model.id);
                                                setIsModelDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${selectedModel === model.id
                                                ? 'bg-white/10 shadow-inner'
                                                : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg ${selectedModel === model.id ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                                                <Cpu className={`w-3.5 h-3.5 ${selectedModel === model.id ? 'text-cyan-400' : 'text-white/40'}`} />
                                            </div>
                                            <div className="flex flex-col items-start flex-1 min-w-0">
                                                <div className="flex items-center justify-between w-full">
                                                    <span className={`text-xs font-medium ${selectedModel === model.id ? 'text-white' : 'text-white/70'}`}>
                                                        {t.modelSelection.models[model.name]}
                                                    </span>
                                                    {selectedModel === model.id && <Check className="w-3 h-3 text-cyan-400" />}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {selectedModel === model.id && (
                                                        <span className="text-[9px] px-1 py-[1px] rounded font-medium uppercase text-cyan-400 bg-cyan-500/10">
                                                            {t.modelSelection.selected}
                                                        </span>
                                                    )}
                                                    <span className="text-[9px] text-white/30 truncate max-w-[120px]">
                                                        {model.provider}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* API Key Input */}
                <div className="bg-black/20 rounded-2xl p-1 border border-white/5">
                    {activeConfig ? (
                        <KeyInput
                            id={activeConfig.id}
                            label={activeConfig.label}
                            value={activeConfig.key}
                            onChange={activeConfig.setKey}
                            placeholder={activeConfig.placeholder}
                            onClear={() => activeConfig.setKey('')}
                            isVisible={!!visibilities[activeConfig.id]}
                            onToggleVisibility={() => toggleVisibility(activeConfig.id)}
                            onCopy={activeConfig.copy}
                            isCopied={activeConfig.copied}
                            t={t}
                            isDarkMode={isDarkMode}
                            providerColorClass={activeConfig.color}
                        />
                    ) : (
                        <div className="p-4 text-center text-xs text-white/30">
                            No configuration needed for this selection.
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleClearCurrentKey}
                        disabled={!activeConfig?.key}
                        className="col-span-1 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all
                            bg-white/5 text-white/50 hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-30 disabled:pointer-events-none
                            border border-white/10"
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        className="col-span-2 py-2.5 px-4 rounded-xl text-xs font-bold tracking-wide uppercase transition-all shadow-lg active:scale-95
                            bg-gradient-to-r from-cyan-500 to-cyan-400 text-black hover:from-cyan-400 hover:to-cyan-300 flex items-center justify-center gap-2"
                    >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        {t.save}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsPanel;
