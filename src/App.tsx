import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

// 组件导入
import { MindMap, MindMapRef } from './components/MindMap/MindMap';
import { ToastContainer, ToastMsg } from './components/Toast';
import { GuideModal, ResetConfirmModal, SettingsPanel } from './components/Modals';
import { AI_MODELS, AIModelId } from './components/Modals/SettingsPanel';
import { TopControls, BottomDock } from './components/Toolbar';
import { ActionCard } from './components/ActionCard';
import { ContextMenu } from './components/Overlay/ContextMenu';
import { FloatingPanel } from './components/Overlay/FloatingPanel';
import { InitialLanding } from './components/InitialLanding';
import { SearchPanel } from './components/Overlay/SearchPanel';
import { HistoryPanel } from './components/Overlay/HistoryPanel';
import { SummaryPanel } from './components/Overlay/SummaryPanel';

// 类型和服务导入
import { MindNode, MindLink, HistoryItem, PersonaType, Language, AppStateSnapshot } from './types';
import { fetchAssociations, generateCreativeProposal, generateThumbnail, generateSummary, generateExplanation } from './services/geminiService';
import { TRANSLATIONS, TranslationStrings } from './i18n';

// 常量
const generateId = () => Math.random().toString(36).substr(2, 9);
const STORAGE_KEY = 'IDEACYCLONE_STATE';
const API_KEY_STORAGE = 'IDEACYCLONE_API_KEY';
const OPENAI_KEY_STORAGE = 'IDEACYCLONE_OPENAI_KEY';
const OPENROUTER_KEY_STORAGE = 'IDEACYCLONE_OPENROUTER_KEY';
const GITHUB_TOKEN_STORAGE = 'IDEACYCLONE_GITHUB_TOKEN';
const GROQ_KEY_STORAGE = 'IDEACYCLONE_GROQ_KEY';
const ALIYUN_KEY_STORAGE = 'IDEACYCLONE_ALIYUN_KEY';
const DEEPSEEK_KEY_STORAGE = 'IDEACYCLONE_DEEPSEEK_KEY';
const ZHIPU_KEY_STORAGE = 'IDEACYCLONE_ZHIPU_KEY';
const MOONSHOT_KEY_STORAGE = 'IDEACYCLONE_MOONSHOT_KEY';
const MODEL_STORAGE = 'IDEACYCLONE_MODEL';
const DEFAULT_API_KEY = '';
const DEFAULT_MODEL: AIModelId = 'gemini-2.5-flash';

const App: React.FC = () => {
    // ========== 状态管理 ==========

    const [nodes, setNodes] = useState<MindNode[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved).nodes.map((n: MindNode) => ({ ...n, loading: false }));
        } catch { }
        return [];
    });

    const [links, setLinks] = useState<MindLink[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved).links : [];
        } catch { }
        return [];
    });

    const [history, setHistory] = useState<HistoryItem[]>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved).history : [];
        } catch { }
        return [];
    });

    // API Keys
    const [apiKey, setApiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(API_KEY_STORAGE) || DEFAULT_API_KEY : DEFAULT_API_KEY));
    const [openaiKey, setOpenaiKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(OPENAI_KEY_STORAGE) || '' : ''));
    const [openRouterKey, setOpenRouterKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(OPENROUTER_KEY_STORAGE) || '' : ''));
    const [githubToken, setGithubToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(GITHUB_TOKEN_STORAGE) || '' : ''));
    const [groqKey, setGroqKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(GROQ_KEY_STORAGE) || '' : ''));
    const [aliyunKey, setAliyunKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(ALIYUN_KEY_STORAGE) || '' : ''));
    const [deepseekKey, setDeepseekKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(DEEPSEEK_KEY_STORAGE) || '' : ''));
    const [zhipuKey, setZhipuKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(ZHIPU_KEY_STORAGE) || '' : ''));
    const [moonshotKey, setMoonshotKey] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem(MOONSHOT_KEY_STORAGE) || '' : ''));

    // UI Configuration
    const [isDarkMode, setIsDarkMode] = useState(true); // 默认暗黑模式
    const [currentPersona, setCurrentPersona] = useState<PersonaType>('standard');
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
    const [selectedModel, setSelectedModel] = useState<AIModelId>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(MODEL_STORAGE) as AIModelId;
            return AI_MODELS.some(m => m.id === stored) ? stored : DEFAULT_MODEL;
        }
        return DEFAULT_MODEL;
    });

    // Stacks
    const [undoStack, setUndoStack] = useState<AppStateSnapshot[]>([]);
    const [redoStack, setRedoStack] = useState<AppStateSnapshot[]>([]);

    // UI State
    const [inputText, setInputText] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [searchQuery] = useState(''); // Removed search query UI for brevity or if not in top controls
    const [hasStarted, setHasStarted] = useState(() => nodes.length > 0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Overlay State
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
    const [floatingItems, setFloatingItems] = useState<{ id: string, text: string }[]>([]);

    // Logic State
    const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
    const [proposalResult, setProposalResult] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [isKeyCopied, setIsKeyCopied] = useState(false);
    const [toasts, setToasts] = useState<ToastMsg[]>([]);
    const [isAISummaryLoading, setIsAISummaryLoading] = useState(false);
    const [summaryContent, setSummaryContent] = useState<string | null>(null);
    const [summaryTitle, setSummaryTitle] = useState<string | null>(null);

    // Refs
    const mindMapRef = useRef<MindMapRef>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Derived
    const selectedNodes = nodes.filter(n => n.selected);
    const t: TranslationStrings = TRANSLATIONS[currentLanguage];
    // 计算当前选择的模型对应的 provider 和活跃的 API Key
    const currentProvider = AI_MODELS.find(m => m.id === selectedModel)?.provider || 'google';
    const activeApiKey = (() => {
        switch (currentProvider) {
            case 'openai': return openaiKey;
            case 'openrouter': return openRouterKey;
            case 'github': return githubToken;
            case 'groq': return groqKey;
            case 'aliyun': return aliyunKey;
            case 'deepseek': return deepseekKey;
            case 'zhipu': return zhipuKey;
            case 'moonshot': return moonshotKey;
            default: return apiKey; // google
        }
    })();

    // Helpers
    const handleModelChange = useCallback((model: AIModelId) => { setSelectedModel(model); localStorage.setItem(MODEL_STORAGE, model); }, []);
    const addToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => { const id = generateId(); setToasts(prev => [...prev, { id, text, type }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000); }, []);
    const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);
    const saveCheckpoint = useCallback(() => { setUndoStack(prev => [...prev.slice(-19), { nodes: nodes.map(n => ({ ...n })), links: links.map(l => ({ ...l })) }]); setRedoStack([]); }, [nodes, links]);

    // Key Setters
    const handleSaveApiKey = useCallback((k: string) => { setApiKey(k); localStorage.setItem(API_KEY_STORAGE, k); }, []);
    const handleSaveOpenaiKey = useCallback((k: string) => { setOpenaiKey(k); localStorage.setItem(OPENAI_KEY_STORAGE, k); }, []);
    const handleSaveOpenRouterKey = useCallback((k: string) => { setOpenRouterKey(k); localStorage.setItem(OPENROUTER_KEY_STORAGE, k); }, []);
    const handleSaveGithubToken = useCallback((k: string) => { setGithubToken(k); localStorage.setItem(GITHUB_TOKEN_STORAGE, k); }, []);
    const handleSaveGroqKey = useCallback((k: string) => { setGroqKey(k); localStorage.setItem(GROQ_KEY_STORAGE, k); }, []);
    const handleSaveAliyunKey = useCallback((k: string) => { setAliyunKey(k); localStorage.setItem(ALIYUN_KEY_STORAGE, k); }, []);
    const handleSaveDeepseekKey = useCallback((k: string) => { setDeepseekKey(k); localStorage.setItem(DEEPSEEK_KEY_STORAGE, k); }, []);
    const handleSaveZhipuKey = useCallback((k: string) => { setZhipuKey(k); localStorage.setItem(ZHIPU_KEY_STORAGE, k); }, []);
    const handleSaveMoonshotKey = useCallback((k: string) => { setMoonshotKey(k); localStorage.setItem(MOONSHOT_KEY_STORAGE, k); }, []);
    const handleCopyKey = useCallback(() => { if (!apiKey) return; navigator.clipboard.writeText(apiKey); setIsKeyCopied(true); setTimeout(() => setIsKeyCopied(false), 2000); addToast(t.toasts.keyCopied, "success"); }, [apiKey, t, addToast]);

    // Undo/Redo
    const handleUndo = useCallback(() => { if (!undoStack.length) return; const prev = undoStack[undoStack.length - 1]; const curr = { nodes: [...nodes], links: [...links] }; setRedoStack(p => [...p, curr]); setNodes(prev.nodes); setLinks(prev.links); setUndoStack(p => p.slice(0, -1)); addToast(t.toasts.undo, "info"); }, [undoStack, nodes, links, t, addToast]);
    const handleRedo = useCallback(() => { if (!redoStack.length) return; const next = redoStack[redoStack.length - 1]; const curr = { nodes: [...nodes], links: [...links] }; setUndoStack(p => [...p, curr]); setNodes(next.nodes); setLinks(next.links); setRedoStack(p => p.slice(0, -1)); addToast(t.toasts.redo, "info"); }, [redoStack, nodes, links, t, addToast]);

    useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify({ nodes, links, history })); }, [nodes, links, history]);
    useEffect(() => { const h = () => setDimensions({ width: window.innerWidth, height: window.innerHeight }); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
    useEffect(() => { const k = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? handleRedo() : handleUndo(); } }; window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k); }, [handleUndo, handleRedo]);

    // Node Operations
    const handleDeleteNodes = useCallback((idsToDelete: string[]) => {
        if (!idsToDelete.length) return;
        saveCheckpoint();

        const allToDelete = new Set<string>();
        const collect = (id: string) => {
            allToDelete.add(id);
            nodes.filter(n => n.parentId === id).forEach(child => collect(child.id));
        };
        idsToDelete.forEach(id => collect(id));

        setNodes(p => p.filter(n => !allToDelete.has(n.id)));
        setLinks(p => p.filter(l => {
            const s = typeof l.source === 'object' ? (l.source as MindNode).id : l.source;
            const t = typeof l.target === 'object' ? (l.target as MindNode).id : l.target;
            return !allToDelete.has(s as string) && !allToDelete.has(t as string);
        }));
        setProposalResult(null);
        addToast(t.toasts.deleted(allToDelete.size), "success");
    }, [nodes, saveCheckpoint, t, addToast]);

    const handleDeleteSelected = useCallback(() => handleDeleteNodes(selectedNodes.map(n => n.id)), [selectedNodes, handleDeleteNodes]);

    const handleInputSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;
        saveCheckpoint();
        const term = inputText.trim();
        setInputText('');
        setHasStarted(true);
        setIsProcessing(true);
        const newId = generateId();
        // For tree layout, root is key. If multiple roots exist, synthetic root handles it.
        const newNode: MindNode = { id: newId, text: term, explanation: 'Input', type: 'root', selected: true, expanded: true, loading: false };
        setNodes(prev => [...prev.map(n => ({ ...n, selected: false })), newNode]);
        setHistory(prev => [{ id: newId, text: term, timestamp: Date.now() }, ...prev]);
        setIsProcessing(false);
        setTimeout(() => mindMapRef.current?.centerView(), 100);
    }, [inputText, saveCheckpoint]);

    const handleAIExpand = useCallback(async (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node || node.loading) return;

        const currentProvider = AI_MODELS.find(m => m.id === selectedModel)?.provider || 'google';
        let activeKey = apiKey;
        if (currentProvider === 'openai') activeKey = openaiKey; else if (currentProvider === 'openrouter') activeKey = openRouterKey; else if (currentProvider === 'github') activeKey = githubToken; else if (currentProvider === 'groq') activeKey = groqKey; else if (currentProvider === 'aliyun') activeKey = aliyunKey; else if (currentProvider === 'deepseek') activeKey = deepseekKey; else if (currentProvider === 'zhipu') activeKey = zhipuKey; else if (currentProvider === 'moonshot') activeKey = moonshotKey;
        if (!activeKey) { setIsSettingsOpen(true); addToast(t.toasts.missingKey, "error"); return; }

        saveCheckpoint();
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, loading: true } : n));

        try {
            const data = await fetchAssociations(node.text, currentPersona, currentLanguage, activeKey, selectedModel);
            const newNodes: MindNode[] = [];
            const newLinks: MindLink[] = [];
            data.associations.forEach((assoc) => {
                const id = generateId();
                newNodes.push({ id, text: assoc.word, explanation: assoc.explanation, type: 'child', selected: false, expanded: false, loading: false, parentId: nodeId });
                newLinks.push({ source: nodeId, target: id });
            });
            // Reset layout for all nodes to ensure D3 tree can reflow correctly without overlap
            setNodes(prev => [
                ...prev.map(n => ({
                    ...n,
                    x: undefined,
                    y: undefined,
                    loading: n.id === nodeId ? false : n.loading,
                    expanded: n.id === nodeId ? true : n.expanded
                })),
                ...newNodes
            ]);
            setLinks(prev => [...prev, ...newLinks]);
            addToast(`${t.toasts.expanded} (${currentLanguage.toUpperCase()})`, "success");
        } catch {
            addToast(t.toasts.expansionFailed, "error");
            setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, loading: false } : n));
        }
    }, [nodes, currentPersona, currentLanguage, apiKey, openaiKey, openRouterKey, githubToken, groqKey, aliyunKey, deepseekKey, zhipuKey, moonshotKey, selectedModel, saveCheckpoint, t, addToast]);

    const handleNodeClick = useCallback(async (nodeId: string) => {
        const clickedNode = nodes.find(n => n.id === nodeId);
        if (!clickedNode || clickedNode.loading) return;

        // Toggle selection logic: Click to select, Click again to deselect
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, selected: !n.selected } : n));
    }, [nodes]);

    const handleNodeToggle = useCallback((nodeId: string, expanded: boolean) => {
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, expanded } : n));
    }, []);

    const handleNodeRightClick = useCallback((nodeId: string, x: number, y: number) => {
        setContextMenu({ x, y, nodeId });
    }, []);

    const handleGenerateImage = useCallback(async () => {
        // 检查是否选择了图像生成模型
        const IMAGE_MODEL_ID = 'gemini-2.5-flash-image-preview';
        if (selectedModel !== IMAGE_MODEL_ID) {
            addToast(t.toasts.switchToImageModel, "error");
            setIsSettingsOpen(true);
            return;
        }
        if (selectedNodes.length !== 1) { addToast(t.toasts.selectOneImg, "error"); return; }
        if (!apiKey) { setIsSettingsOpen(true); addToast(t.toasts.missingKey, "error"); return; }
        saveCheckpoint(); setIsGeneratingImage(true);
        const node = selectedNodes[0];
        setNodes(prev => prev.map(n => n.id === node.id ? { ...n, loading: true } : n));
        try {
            const imageUrl = await generateThumbnail(node.text, apiKey);
            if (imageUrl) {
                setNodes(prev => prev.map(n => n.id === node.id ? { ...n, loading: false, imageUrl } : n));
                addToast(t.toasts.imgGen, "success");
            } else throw new Error;
        } catch {
            setNodes(prev => prev.map(n => n.id === node.id ? { ...n, loading: false } : n));
            addToast(t.toasts.imgFail, "error");
        } finally { setIsGeneratingImage(false); }
    }, [selectedNodes, apiKey, selectedModel, saveCheckpoint, t, addToast]);
    const handleGenerateProposal = useCallback(async () => { /* Simplified */ if (!selectedNodes.length) { addToast(t.toasts.selectNodesFusion, "error"); return; } const currentProvider = AI_MODELS.find(m => m.id === selectedModel)?.provider || 'google'; let activeKey = apiKey; /* Keys */ if (currentProvider === 'openai') activeKey = openaiKey; else if (currentProvider === 'openrouter') activeKey = openRouterKey; else if (currentProvider === 'github') activeKey = githubToken; else if (currentProvider === 'groq') activeKey = groqKey; else if (currentProvider === 'aliyun') activeKey = aliyunKey; else if (currentProvider === 'deepseek') activeKey = deepseekKey; else if (currentProvider === 'zhipu') activeKey = zhipuKey; else if (currentProvider === 'moonshot') activeKey = moonshotKey; if (!activeKey) { setIsSettingsOpen(true); addToast(t.toasts.missingKey, "error"); return; } setIsGeneratingProposal(true); setProposalResult(null); try { const k = selectedNodes.map(n => n.text); const res = await generateCreativeProposal(k, currentLanguage, activeKey, selectedModel); setProposalResult(res); addToast(t.toasts.conceptGen, "success"); } catch { addToast(t.toasts.conceptFail, "error"); } finally { setIsGeneratingProposal(false); } }, [selectedNodes, apiKey, openaiKey, openRouterKey, githubToken, groqKey, aliyunKey, deepseekKey, zhipuKey, moonshotKey, selectedModel, currentLanguage, t, addToast]);

    const confirmReset = useCallback(() => { setNodes([]); setLinks([]); setHistory([]); setUndoStack([]); setRedoStack([]); setHasStarted(false); setProposalResult(null); localStorage.removeItem(STORAGE_KEY); addToast(t.toasts.reset, "success"); setShowResetConfirm(false); }, [t, addToast]);
    const handleSaveProject = useCallback(() => { /* ... */ const p = { version: '1.0', timestamp: Date.now(), nodes, links, history }; const b = new Blob([JSON.stringify(p, null, 2)], { type: "application/json" }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `ideacyclone-${new Date().toISOString().slice(0, 10)}.ideaspark`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(u); addToast(t.toasts.projectSaved, "success"); }, [nodes, links, history, t, addToast]);
    const handleLoadProject = useCallback((e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = (ev) => { try { const c = ev.target?.result as string; const p = JSON.parse(c); if (p.nodes) { saveCheckpoint(); setNodes(p.nodes); setLinks(p.links || []); setHistory(p.history || []); setHasStarted(p.nodes.length > 0); addToast(t.toasts.projectLoaded, "success"); } } catch { addToast(t.project.loadError, "error"); } finally { if (fileInputRef.current) fileInputRef.current.value = ''; } }; r.readAsText(f); }, [saveCheckpoint, t, addToast]);

    const handleExportPNG = useCallback(async () => { if (!mindMapRef.current) return; try { const d = await mindMapRef.current.exportToImage(); const a = document.createElement('a'); a.href = d; a.download = `ideacyclone.png`; a.click(); addToast(t.toasts.exportPng, "success"); } catch { addToast(t.toasts.exportFail, "error"); } }, [t, addToast]);
    const handleExportJSON = useCallback(() => { const d = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, links }, null, 2)); const a = document.createElement('a'); a.href = d; a.download = "ideacyclone.json"; a.click(); addToast(t.toasts.exportJson, "success"); }, [nodes, links, t, addToast]);
    const handleExportMD = useCallback(() => { let m = "# IdeaCyclone\n\n"; nodes.forEach(n => { m += `- **${n.text}**${n.explanation ? ` - ${n.explanation}` : ''}\n`; }); const d = "data:text/markdown;charset=utf-8," + encodeURIComponent(m); const a = document.createElement('a'); a.href = d; a.download = "ideacyclone.md"; a.click(); addToast(t.toasts.exportMd, "success"); }, [nodes, t, addToast]);
    const handleExportSVG = useCallback(() => { const s = document.querySelector('svg.mind-map-svg'); if (!s) { addToast(t.toasts.exportFail, "error"); return; } const serializer = new XMLSerializer(); const str = serializer.serializeToString(s); const blob = new Blob([str], { type: 'image/svg+xml' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'ideacyclone.svg'; a.click(); URL.revokeObjectURL(url); addToast(t.exportSvg, "success"); }, [t, addToast]);
    const handleAISummary = useCallback(async () => {
        if (!nodes.length) {
            addToast(t.aiSummary.noNodes, "info");
            return;
        }
        setIsAISummaryLoading(true);

        const currentProvider = AI_MODELS.find(m => m.id === selectedModel)?.provider || 'google';
        let activeKey = apiKey;
        if (currentProvider === 'openai') activeKey = openaiKey;
        else if (currentProvider === 'openrouter') activeKey = openRouterKey;
        else if (currentProvider === 'github') activeKey = githubToken;
        else if (currentProvider === 'groq') activeKey = groqKey;
        else if (currentProvider === 'aliyun') activeKey = aliyunKey;
        else if (currentProvider === 'deepseek') activeKey = deepseekKey;
        else if (currentProvider === 'zhipu') activeKey = zhipuKey;
        else if (currentProvider === 'moonshot') activeKey = moonshotKey;

        if (!activeKey) {
            setIsSettingsOpen(true);
            addToast(t.toasts.missingKey, "error");
            setIsAISummaryLoading(false);
            return;
        }

        try {
            const nodeTexts = nodes.map(n => n.text).join(', ');
            const summary = await generateSummary(nodeTexts, currentLanguage, activeKey, selectedModel);
            // addToast(`${t.aiSummary.title}: ${summary}`, "success");
            setSummaryTitle(null);
            setSummaryContent(summary);
        } catch (e) {
            console.error(e);
            addToast(t.toasts.conceptFail, "error");
        } finally {
            setIsAISummaryLoading(false);
        }
    }, [nodes, apiKey, selectedModel, currentLanguage, t, addToast, openaiKey, openRouterKey, githubToken, groqKey, aliyunKey, deepseekKey, zhipuKey, moonshotKey]);

    const handleRestoreHistory = useCallback((text: string) => {
        // Find if node exists
        const existingNode = nodes.find(n => n.text === text);
        if (existingNode) {
            mindMapRef.current?.centerView(); // Ideally center on specific node, but API limited
            addToast(`Located: ${text}`, "success");
        } else {
            setInputText(text);
            handleInputSubmit();
        }
    }, [nodes, handleInputSubmit, addToast]);

    // 框选多节点处理
    const handleBoxSelect = useCallback((nodeIds: string[]) => {
        setNodes(prev => prev.map(n => ({
            ...n,
            selected: nodeIds.includes(n.id)
        })));
    }, []);

    const handleExplainNode = useCallback(async (nodeId: string) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        const currentProvider = AI_MODELS.find(m => m.id === selectedModel)?.provider || 'google';
        let activeKey = apiKey;
        if (currentProvider === 'openai') activeKey = openaiKey;
        else if (currentProvider === 'openrouter') activeKey = openRouterKey;
        else if (currentProvider === 'github') activeKey = githubToken;
        else if (currentProvider === 'groq') activeKey = groqKey;
        else if (currentProvider === 'aliyun') activeKey = aliyunKey;
        else if (currentProvider === 'deepseek') activeKey = deepseekKey;
        else if (currentProvider === 'zhipu') activeKey = zhipuKey;
        else if (currentProvider === 'moonshot') activeKey = moonshotKey;

        if (!activeKey) {
            setIsSettingsOpen(true);
            addToast(t.toasts.missingKey, "error");
            return;
        }

        // Set node to loading state
        setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, loading: true } : n));
        setIsAISummaryLoading(true);

        try {
            const explanation = await generateExplanation(node.text, currentLanguage, activeKey, selectedModel);
            setSummaryTitle(t.aiSummary.explanationTitle);
            setSummaryContent(explanation);
        } catch (e) {
            console.error(e);
            addToast(t.toasts.conceptFail, "error");
        } finally {
            // Reset node loading state
            setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, loading: false } : n));
            setIsAISummaryLoading(false);
        }
    }, [nodes, apiKey, selectedModel, currentLanguage, t, addToast, openaiKey, openRouterKey, githubToken, groqKey, aliyunKey, deepseekKey, zhipuKey, moonshotKey]);

    const handleNodeDragEnd = useCallback((updates: { id: string, x: number, y: number }[]) => {
        setNodes(prev => prev.map(n => {
            const update = updates.find(u => u.id === n.id);
            if (update) {
                return { ...n, x: update.x, y: update.y };
            }
            return n;
        }));
    }, []);

    const handleChangePersona = useCallback(() => { const m: PersonaType[] = ['standard', 'creative', 'logic', 'business', 'poetic']; setCurrentPersona(m[(m.indexOf(currentPersona) + 1) % m.length]); }, [currentPersona]);
    const handleChangeLanguage = useCallback(() => {
        const languages: Language[] = ['en', 'zh', 'ja'];
        const nextLang = languages[(languages.indexOf(currentLanguage) + 1) % languages.length];
        setCurrentLanguage(nextLang);
        addToast(TRANSLATIONS[nextLang].toasts.langSwitched(nextLang.toUpperCase()), 'info');
    }, [currentLanguage, addToast]);

    return (
        <div className={`relative w-full h-screen transition-colors duration-500 selection:bg-yellow-200 overflow-hidden ${isDarkMode ? 'bg-[#111827] text-white' : 'bg-slate-50 text-slate-900'}`} onClick={() => setContextMenu(null)}>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <input type="file" ref={fileInputRef} onChange={handleLoadProject} className="hidden" accept=".json,.ideaspark" />

            {/* Initial Landing (shown when no nodes exist) */}
            {!hasStarted && (
                <InitialLanding
                    inputText={inputText}
                    onInputChange={setInputText}
                    onSubmit={handleInputSubmit}
                    isProcessing={isProcessing}
                    isDarkMode={isDarkMode}
                    placeholder={t.getPlaceholder(currentPersona)}
                    subtitle={t.subtitle}
                    currentLanguage={currentLanguage}
                />
            )}

            {/* MindMap Canvas (always rendered but may be hidden behind InitialLanding) */}
            <div className={`absolute inset-0 z-0 ${!hasStarted ? 'pointer-events-none opacity-0' : ''}`}>
                <MindMap
                    ref={mindMapRef}
                    nodes={nodes}
                    links={links}
                    onNodeClick={handleNodeClick}
                    onNodeToggle={handleNodeToggle}
                    onNodeRightClick={handleNodeRightClick}
                    onBoxSelect={handleBoxSelect}
                    onNodeDragEnd={handleNodeDragEnd}
                    width={dimensions.width}
                    height={dimensions.height}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Top Controls (always visible) */}
            <TopControls
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenGuide={() => setIsGuideOpen(true)}
                currentPersona={currentPersona}
                onChangePersona={handleChangePersona}
                currentLanguage={currentLanguage}
                onChangeLanguage={handleChangeLanguage}
                isSettingsOpen={isSettingsOpen}
                onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
                t={t}
                hasApiKey={!!activeApiKey}
            />

            {/* Input Overlay (only when hasStarted) */}
            {hasStarted && (
                <div className="absolute top-[4.5rem] md:top-6 left-0 right-0 z-30 flex justify-center pointer-events-none px-4 md:px-0">
                    <form
                        onSubmit={handleInputSubmit}
                        className="pointer-events-auto w-full max-w-md md:max-w-xl relative group transition-all duration-300"
                    >
                        <div className="relative flex items-center">
                            <div className="absolute left-3 md:left-4 text-gray-400">
                                {isProcessing ? <Loader2 className="animate-spin w-4 h-4 md:w-5 md:h-5" /> : <Sparkles className="w-4 h-4 md:w-5 md:h-5" />}
                            </div>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t.getPlaceholder(t.modes[currentPersona])}
                                disabled={isProcessing}
                                className={`w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 rounded-xl border-2 transition-all duration-300 outline-none text-sm md:text-base ${isDarkMode
                                    ? 'bg-gray-800/90 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:bg-gray-800'
                                    : 'bg-white/90 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:bg-white'
                                    } backdrop-blur-sm shadow-lg focus:shadow-xl`}
                            />
                        </div>
                    </form>
                </div>
            )}

            {/* Overlays */}

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    nodeId={contextMenu.nodeId}
                    onClose={() => setContextMenu(null)}
                    onDelete={(id) => handleDeleteNodes([id])}
                    onExpand={handleAIExpand}
                    onExplain={handleExplainNode}
                    isDarkMode={isDarkMode}
                    t={t}
                />
            )}

            <ActionCard
                selectedNodes={selectedNodes}
                isDarkMode={isDarkMode}
                t={t}
                proposalResult={proposalResult}
                isGeneratingImage={isGeneratingImage}
                isGeneratingProposal={isGeneratingProposal}
                hasGoogleApiKey={!!apiKey}
                onGenerateImage={handleGenerateImage}
                onGenerateProposal={handleGenerateProposal}
                onClearProposal={() => setProposalResult(null)}
                onDeleteSelected={handleDeleteSelected}
                onClearSelection={() => setNodes(p => p.map(n => ({ ...n, selected: false })))}
                onExpand={() => {
                    if (selectedNodes.length === 1) handleAIExpand(selectedNodes[0].id);
                }}
                onExplain={() => {
                    if (selectedNodes.length === 1) handleExplainNode(selectedNodes[0].id);
                }}
            />

            <BottomDock
                hasStarted={hasStarted}
                onReset={() => setShowResetConfirm(true)}
                onSave={handleSaveProject}
                onLoad={() => fileInputRef.current?.click()}
                onExportPNG={handleExportPNG}
                onExportJSON={handleExportJSON}
                onExportMD={handleExportMD}
                onExportSVG={handleExportSVG}
                onAISummary={handleAISummary}
                isAISummaryLoading={isAISummaryLoading}
                canUndo={undoStack.length > 0}
                canRedo={redoStack.length > 0}
                onUndo={handleUndo}
                onRedo={handleRedo}
                isDarkMode={isDarkMode}
                isSearchOpen={isSearchOpen}
                isHistoryOpen={isHistoryOpen}
                onToggleSearch={() => setIsSearchOpen(!isSearchOpen)}
                onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
                onCenterView={() => mindMapRef.current?.centerView()}
                t={t}
                nodes={nodes}
                historyItems={history}
                onNodeClick={(id) => {
                    mindMapRef.current?.centerView();
                    setNodes(prev => prev.map(n => ({ ...n, selected: n.id === id })));
                }}
                onRestoreHistory={handleRestoreHistory}
            />


            {/* Modals */}
            <SummaryPanel
                isOpen={!!summaryContent}
                onClose={() => setSummaryContent(null)}
                content={summaryContent || ''}
                isDarkMode={isDarkMode}
                t={t}
                title={summaryTitle || undefined}
            />
            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                isDarkMode={isDarkMode}
                t={t}
                apiKey={apiKey}
                onSaveApiKey={handleSaveApiKey}
                onCopyKey={handleCopyKey}
                isKeyCopied={isKeyCopied}
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
                openaiKey={openaiKey}
                onSaveOpenaiKey={handleSaveOpenaiKey}
                openRouterKey={openRouterKey}
                onSaveOpenRouterKey={handleSaveOpenRouterKey}
                githubToken={githubToken}
                onSaveGithubToken={handleSaveGithubToken}
                groqKey={groqKey}
                onSaveGroqKey={handleSaveGroqKey}
                aliyunKey={aliyunKey}
                onSaveAliyunKey={handleSaveAliyunKey}
                deepseekKey={deepseekKey}
                onSaveDeepseekKey={handleSaveDeepseekKey}
                zhipuKey={zhipuKey}
                onSaveZhipuKey={handleSaveZhipuKey}
                moonshotKey={moonshotKey}
                onSaveMoonshotKey={handleSaveMoonshotKey}
                onSaveComplete={() => addToast(t.toasts.keySaved, "success")}
            />

            <GuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
                isDarkMode={isDarkMode}
                t={t}
            />

            <ResetConfirmModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={confirmReset}
                isDarkMode={isDarkMode}
                t={t}
            />
        </div>
    );
};

export default App;
