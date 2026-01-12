import React, { useState } from 'react';
import {
    RotateCcw, Save, FolderOpen, Undo2, Redo2,
    Search, History, Maximize, MoreHorizontal,
    Image as ImageIcon, FileJson, FileText, FileCode, Sparkles
} from 'lucide-react';
import { TranslationStrings } from '../../i18n';
import { MindNode, HistoryItem } from '../../types';
import { SearchPanel } from '../Overlay/SearchPanel';
import { HistoryPanel } from '../Overlay/HistoryPanel';

interface BottomDockProps {
    isDarkMode: boolean;
    t: TranslationStrings;
    // 项目操作
    onReset: () => void;
    onSave: () => void;
    onLoad: () => void;
    // 编辑操作
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    // 搜索和历史
    isSearchOpen: boolean;
    isHistoryOpen: boolean;
    onToggleSearch: () => void;
    onToggleHistory: () => void;
    // 视图操作
    onCenterView: () => void;
    // 导出操作
    onExportPNG: () => void;
    onExportJSON: () => void;
    onExportMD: () => void;
    onExportSVG: () => void;
    // AI 功能
    onAISummary: () => void;
    isAISummaryLoading?: boolean;
    // 隐藏模式 (可选，用于初始欢迎页)
    hasStarted?: boolean;
    // Data props for panels
    nodes: MindNode[];
    historyItems: HistoryItem[];
    onNodeClick: (id: string) => void;
    onRestoreHistory: (text: string) => void;
}

/**
 * 底部工具栏组件
 * 包含项目管理、编辑、搜索、视图和导出功能
 * 移动端响应式：减小尺寸，将次要功能移入溢出菜单
 */
export const BottomDock: React.FC<BottomDockProps> = ({
    isDarkMode,
    t,
    onReset,
    onSave,
    onLoad,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    isSearchOpen,
    isHistoryOpen,
    onToggleSearch,
    onToggleHistory,
    onCenterView,
    onExportPNG,
    onExportJSON,
    onExportMD,
    onExportSVG,
    onAISummary,
    isAISummaryLoading = false,

    hasStarted = true,
    nodes,
    historyItems,
    onNodeClick,
    onRestoreHistory
}) => {
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    // Tooltip 组件 - 移动端隐藏
    const Tooltip: React.FC<{ text: string }> = ({ text }) => (
        <span
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-lg hidden md:block"
            role="tooltip"
        >
            {text}
        </span>
    );

    // 通用按钮样式 - 移动端更紧凑
    const btnBase = `p-1.5 md:p-2.5 rounded-lg md:rounded-xl transition-colors relative group`;
    const iconSize = `w-4 h-4 md:w-5 md:h-5`;

    return (
        <div className="fixed bottom-3 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center animate-in slide-in-from-bottom-10 duration-700 px-2">
            <nav
                className={`flex items-center gap-0.5 md:gap-1 p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-2xl border max-w-[calc(100vw-1rem)] ${isDarkMode ? 'bg-[#1F2937]/90 border-gray-700/50' : 'bg-white/90 border-slate-200/60'
                    }`}
                role="toolbar"
                aria-label="Main toolbar"
            >
                {/* 项目工具组 - 保留核心功能 */}
                <div className="flex gap-0.5 md:gap-1 pr-1.5 md:pr-2 border-r border-gray-500/20">
                    <button
                        onClick={onReset}
                        className={`${btnBase} hover:bg-red-500/10 ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                        aria-label={t.aria.resetBtn}
                        title={t.project.new}
                    >
                        <RotateCcw className={iconSize} aria-hidden="true" />
                        <Tooltip text={t.project.new} />
                    </button>

                    <button
                        onClick={onSave}
                        className={`${btnBase} hover:bg-blue-500/10 ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-slate-500 hover:text-blue-600'}`}
                        aria-label={t.aria.saveBtn}
                        title={t.project.save}
                    >
                        <Save className={iconSize} aria-hidden="true" />
                        <Tooltip text={t.project.save} />
                    </button>

                    <button
                        onClick={onLoad}
                        className={`${btnBase} hover:bg-yellow-500/10 ${isDarkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-slate-500 hover:text-yellow-600'}`}
                        aria-label={t.aria.loadBtn}
                        title={t.project.load}
                    >
                        <FolderOpen className={iconSize} aria-hidden="true" />
                        <Tooltip text={t.project.load} />
                    </button>
                </div>

                {/* 编辑工具组 */}
                <div className="flex gap-0.5 md:gap-1 px-1.5 md:px-2 border-r border-gray-500/20">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className={`${btnBase} hover:bg-slate-500/10 disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        aria-label={t.aria.undoBtn}
                        aria-disabled={!canUndo}
                        title={t.toasts.undo}
                    >
                        <Undo2 className={iconSize} aria-hidden="true" />
                        <Tooltip text={t.toasts.undo} />
                    </button>

                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className={`${btnBase} hover:bg-slate-500/10 disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        aria-label={t.aria.redoBtn}
                        aria-disabled={!canRedo}
                        title={t.toasts.redo}
                    >
                        <Redo2 className={iconSize} aria-hidden="true" />
                        <Tooltip text={t.toasts.redo} />
                    </button>
                </div>

                {/* 搜索和历史组 - 移动端隐藏，移入更多菜单 */}
                <div className="hidden md:flex gap-1 px-2 border-r border-gray-500/20 relative">
                    <button
                        onClick={onToggleSearch}
                        className={`${btnBase} hover:bg-slate-500/10 ${isSearchOpen ? 'bg-slate-500/10 text-blue-600' : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                        aria-label={t.aria.searchBtn}
                        aria-expanded={isSearchOpen}
                        title={t.searchPlaceholder}
                    >
                        <Search className={iconSize} aria-hidden="true" />
                        <Tooltip text="Search" />
                    </button>

                    <button
                        onClick={onToggleHistory}
                        className={`${btnBase} hover:bg-slate-500/10 ${isHistoryOpen ? 'bg-slate-500/10 text-blue-600' : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')}`}
                        aria-label={t.aria.historyBtn}
                        aria-expanded={isHistoryOpen}
                        title="History"
                    >
                        <History className={iconSize} aria-hidden="true" />
                        <Tooltip text="History" />
                    </button>

                    {/* Desktop Panels positioned relative to this group */}
                    <SearchPanel
                        isOpen={isSearchOpen}
                        onClose={onToggleSearch}
                        nodes={nodes}
                        onNodeClick={onNodeClick}
                        isDarkMode={isDarkMode}
                        t={t}
                        className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50 w-80 rounded-xl shadow-2xl border transition-all duration-300 flex flex-col max-h-[60vh] ${isDarkMode ? 'bg-[#1F2937]/95 border-gray-700' : 'bg-white/95 border-slate-200'
                            }`}
                    />
                    <HistoryPanel
                        isOpen={isHistoryOpen}
                        onClose={onToggleHistory}
                        historyItems={historyItems}
                        onRestore={onRestoreHistory}
                        isDarkMode={isDarkMode}
                        t={t}
                        className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50 w-72 rounded-xl shadow-2xl border transition-all duration-300 flex flex-col max-h-[60vh] ${isDarkMode ? 'bg-[#1F2937]/95 border-gray-700' : 'bg-white/95 border-slate-200'
                            }`}
                    />
                </div>

                {/* 视图工具组 */}
                <div className="flex gap-0.5 md:gap-1 px-1.5 md:px-2 border-r border-gray-500/20">
                    <button
                        onClick={onCenterView}
                        className={`${btnBase} hover:bg-slate-500/10 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                        aria-label={t.aria.centerBtn}
                        title="Center View"
                    >
                        <Maximize className={iconSize} aria-hidden="true" />
                        <Tooltip text="Center" />
                    </button>
                </div>

                {/* AI 总结按钮 - 移动端隐藏，移入更多菜单 */}
                <div className="hidden md:flex gap-1 px-2 border-r border-gray-500/20">
                    <button
                        onClick={onAISummary}
                        disabled={isAISummaryLoading}
                        className={`${btnBase} hover:bg-cyan-500/10 disabled:opacity-50 ${isDarkMode ? 'text-gray-400 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-600'}`}
                        aria-label={t.aiSummary.btn}
                        title={t.aiSummary.btn}
                    >
                        <Sparkles className={`${iconSize} ${isAISummaryLoading ? 'animate-pulse' : ''}`} aria-hidden="true" />
                        <Tooltip text={t.aiSummary.btn} />
                    </button>
                </div>

                {/* 更多菜单 - 包含导出和移动端隐藏的功能 */}
                <div className="flex gap-0.5 md:gap-1 pl-1.5 md:pl-2 relative">
                    <button
                        onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                        onBlur={() => setTimeout(() => setIsMoreMenuOpen(false), 200)}
                        className={`${btnBase} hover:bg-purple-500/10 ${isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-slate-500 hover:text-purple-600'}`}
                        aria-label={t.aria.exportBtn}
                        aria-expanded={isMoreMenuOpen}
                        aria-haspopup="menu"
                        title="More"
                    >
                        <MoreHorizontal className={iconSize} aria-hidden="true" />
                    </button>

                    {/* 更多菜单 - 包含导出 + 移动端功能 */}
                    <div
                        className={`absolute bottom-12 md:bottom-14 right-0 flex flex-col gap-0.5 p-1 rounded-xl shadow-xl border transition-all min-w-[140px] ${isMoreMenuOpen
                            ? 'opacity-100 translate-y-0 pointer-events-auto'
                            : 'opacity-0 translate-y-2 pointer-events-none'
                            } ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}
                        role="menu"
                        aria-label="More options"
                    >
                        {/* 移动端显示的功能 */}
                        <div className="md:hidden">
                            <button
                                onClick={() => { onAISummary(); setIsMoreMenuOpen(false); }}
                                disabled={isAISummaryLoading}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer disabled:opacity-50 ${isDarkMode ? 'hover:bg-gray-700 text-cyan-400' : 'hover:bg-slate-100 text-cyan-600'}`}
                                role="menuitem"
                            >
                                <Sparkles className="w-4 h-4" aria-hidden="true" />
                                <span className="text-xs font-medium">{t.aiSummary.btn}</span>
                            </button>
                            <button
                                onClick={() => { onToggleSearch(); setIsMoreMenuOpen(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-slate-100 text-slate-800'}`}
                                role="menuitem"
                            >
                                <Search className="w-4 h-4" aria-hidden="true" />
                                <span className="text-xs font-medium">Search</span>
                            </button>
                            <button
                                onClick={() => { onToggleHistory(); setIsMoreMenuOpen(false); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-slate-100 text-slate-800'}`}
                                role="menuitem"
                            >
                                <History className="w-4 h-4" aria-hidden="true" />
                                <span className="text-xs font-medium">History</span>
                            </button>
                            <div className="my-1 border-t border-gray-500/20" />
                        </div>

                        {/* 导出选项 */}
                        <button
                            onClick={() => { onExportPNG(); setIsMoreMenuOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-slate-100 text-slate-800'}`}
                            role="menuitem"
                        >
                            <ImageIcon className="w-4 h-4" aria-hidden="true" />
                            <span className="text-xs font-medium">PNG</span>
                        </button>
                        <button
                            onClick={() => { onExportJSON(); setIsMoreMenuOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}
                            role="menuitem"
                        >
                            <FileJson className="w-4 h-4" aria-hidden="true" />
                            <span className="text-xs font-medium">JSON</span>
                        </button>
                        <button
                            onClick={() => { onExportMD(); setIsMoreMenuOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}
                            role="menuitem"
                        >
                            <FileText className="w-4 h-4" aria-hidden="true" />
                            <span className="text-xs font-medium">Markdown</span>
                        </button>
                        <button
                            onClick={() => { onExportSVG(); setIsMoreMenuOpen(false); }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-800'}`}
                            role="menuitem"
                        >
                            <FileCode className="w-4 h-4" aria-hidden="true" />
                            <span className="text-xs font-medium">SVG</span>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default BottomDock;
