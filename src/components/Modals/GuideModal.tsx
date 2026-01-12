import React, { useRef, useEffect, useState } from 'react';
import {
    X, BookOpen, ExternalLink,
    Moon, Sun, Settings, RotateCcw, Save, FolderOpen,
    Undo2, Redo2, Search, History, Maximize, MoreHorizontal,
    Image as ImageIcon, FileJson, FileText, Sparkles, Languages,
    MousePointer2, MousePointerClick, Move, BoxSelect
} from 'lucide-react';
import { TranslationStrings } from '../../i18n';
import { useClickOutside } from '../../hooks';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    isDarkMode: boolean;
    t: TranslationStrings;
}

type TabType = 'setup' | 'legend' | 'controls';

/**
 * 使用指南模态框
 * 包含：
 * 1. Setup: API Key 获取和配置指南
 * 2. Legend: 界面功能图标说明
 */
export const GuideModal: React.FC<GuideModalProps> = ({
    isOpen,
    onClose,
    isDarkMode,
    t
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const [activeTab, setActiveTab] = useState<TabType>('setup');

    // 点击外部关闭
    useClickOutside(modalRef, onClose, isOpen);

    // 打开时聚焦关闭按钮
    useEffect(() => {
        if (isOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isOpen]);

    // 阻止滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setActiveTab('setup'); // 每次打开重置为 Setup
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    // 通用样式
    const cardClass = `p-4 rounded-2xl border ${isDarkMode ? 'bg-black/20 border-gray-700' : 'bg-slate-50 border-slate-200'}`;
    const textClass = `text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-slate-700'}`;
    const descClass = `text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-modal-title"
        >
            <div
                ref={modalRef}
                className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl border animate-in zoom-in-95 duration-200 ${isDarkMode
                    ? 'bg-[#1F2937] border-gray-700 text-white'
                    : 'bg-white border-white text-slate-900'
                    }`}
            >
                {/* 顶部标题栏 */}
                <div className="flex-none p-6 pb-2 md:p-8 md:pb-4 flex justify-between items-start">
                    <div>
                        <h2
                            id="guide-modal-title"
                            className="text-2xl font-bold flex items-center gap-2"
                        >
                            <BookOpen className="w-6 h-6 text-cyan-500" aria-hidden="true" />
                            {t.guide.title}
                        </h2>
                        {/* Tab 切换 */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setActiveTab('setup')}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === 'setup'
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                                    : `hover:bg-slate-500/10 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`
                                    }`}
                            >
                                {t.interfaceGuide.tabSetup}
                            </button>
                            <button
                                onClick={() => setActiveTab('legend')}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === 'legend'
                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25'
                                    : `hover:bg-slate-500/10 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`
                                    }`}
                            >
                                {t.interfaceGuide.tabLegend}
                            </button>
                            <button
                                onClick={() => setActiveTab('controls')}
                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === 'controls'
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : `hover:bg-slate-500/10 ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`
                                    }`}
                            >
                                {t.controls.tab}
                            </button>
                        </div>
                    </div>

                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        aria-label={t.aria.closeBtn}
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* 内容滚动区 */}
                <div className="flex-1 overflow-y-auto p-6 pt-2 md:p-8 md:pt-4">
                    {activeTab === 'setup' ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* 步骤 1: 配置软件 */}
                            <div className={cardClass}>
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs">
                                        1
                                    </span>
                                    {t.guide.step2Title}
                                </h3>
                                <p className={textClass}>
                                    {t.guide.step2Desc}
                                </p>
                            </div>

                            {/* 免责声明 */}
                            <div className={`p-4 rounded-2xl border border-amber-500/30 ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50'
                                }`}>
                                <h3 className="font-bold text-sm mb-1 text-amber-600 dark:text-amber-400">
                                    ⚠️ {t.guide.disclaimerTitle}
                                </h3>
                                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-amber-200/80' : 'text-amber-700'
                                    }`}>
                                    {t.guide.disclaimerText}
                                </p>
                            </div>
                        </div>
                    ) : activeTab === 'legend' ? (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            {/* 顶部控制栏图例 */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4 px-1">
                                    {t.interfaceGuide.sections.topBar}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                                            <Sparkles className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{t.interfaceGuide.captions.mode}</div>
                                            <div className={descClass}>{t.interfaceGuide.captions.modeDesc}</div>
                                        </div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                            <Languages className="w-5 h-5" />
                                        </div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.lang}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                                            <Sun className="w-5 h-5" />
                                        </div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.theme}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500">
                                            <Settings className="w-5 h-5" />
                                        </div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.settings}</div>
                                    </div>
                                </div>
                            </section>

                            {/* 底部工具栏图例 */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4 px-1">
                                    {t.interfaceGuide.sections.bottomDock}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-red-500/10 rounded-lg text-red-500"><RotateCcw className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.reset}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Save className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.save}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><FolderOpen className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.load}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500"><Undo2 className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.undo}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500"><Redo2 className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.redo}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><Search className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.search}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><History className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.history}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500"><Maximize className="w-4 h-4" /></div>
                                        <div className="font-bold text-sm">{t.interfaceGuide.captions.center}</div>
                                    </div>
                                    <div className={`${cardClass} flex items-center gap-3`}>
                                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><MoreHorizontal className="w-4 h-4" /></div>
                                        <div className={`font-bold text-sm truncate`} title={t.interfaceGuide.captions.export}>
                                            {t.interfaceGuide.captions.export}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* 键盘快捷键 */}
                            <section>
                                <h3 className="text-sm font-bold uppercase tracking-wider opacity-50 mb-4 px-1">
                                    {t.interfaceGuide.shortcuts.title}
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`${cardClass} flex items-center justify-between`}>
                                        <span className="font-medium text-sm">{t.interfaceGuide.shortcuts.items.undo}</span>
                                        <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>Ctrl+Z</kbd>
                                    </div>
                                    <div className={`${cardClass} flex items-center justify-between`}>
                                        <span className="font-medium text-sm">{t.interfaceGuide.shortcuts.items.redo}</span>
                                        <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>Ctrl+Shift+Z</kbd>
                                    </div>
                                    <div className={`${cardClass} flex items-center justify-between`}>
                                        <span className="font-medium text-sm">{t.interfaceGuide.shortcuts.items.search}</span>
                                        <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>Ctrl+F</kbd>
                                    </div>
                                    <div className={`${cardClass} flex items-center justify-between`}>
                                        <span className="font-medium text-sm">{t.interfaceGuide.shortcuts.items.delete}</span>
                                        <kbd className={`px-2 py-1 rounded text-xs font-mono ${isDarkMode ? 'bg-black/30' : 'bg-slate-100'}`}>Delete</kbd>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid gap-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                                    <MousePointer2 className="w-5 h-5 text-cyan-500" />
                                    {t.controls.mouseTitle}
                                </h3>

                                <div className={`${cardClass} flex items-start gap-4`}>
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 shrink-0">
                                        <MousePointerClick className="w-6 h-6" />
                                        <div className="text-[10px] font-bold text-center mt-1">L</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">{t.controls.leftClick.title}</h4>
                                        <p className={textClass}>{t.controls.leftClick.desc}</p>
                                    </div>
                                </div>

                                <div className={`${cardClass} flex items-start gap-4`}>
                                    <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500 shrink-0">
                                        <MousePointer2 className="w-6 h-6" />
                                        <div className="text-[10px] font-bold text-center mt-1">R</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">{t.controls.rightClick.title}</h4>
                                        <p className={textClass}>{t.controls.rightClick.desc}</p>
                                    </div>
                                </div>

                                <div className={`${cardClass} flex items-start gap-4`}>
                                    <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 shrink-0">
                                        <Move className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">{t.controls.midClick.title}</h4>
                                        <p className={textClass}>{t.controls.midClick.desc}</p>
                                    </div>
                                </div>

                                <div className={`${cardClass} flex items-start gap-4`}>
                                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500 shrink-0">
                                        <Maximize className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">{t.controls.scroll.title}</h4>
                                        <p className={textClass}>{t.controls.scroll.desc}</p>
                                    </div>
                                </div>

                                <div className={`${cardClass} flex items-start gap-4`}>
                                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500 shrink-0">
                                        <BoxSelect className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-base mb-1">{t.controls.boxSelect.title}</h4>
                                        <p className={textClass}>{t.controls.boxSelect.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuideModal;
