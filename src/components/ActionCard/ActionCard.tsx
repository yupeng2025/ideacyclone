import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    X, Trash2, Loader2, ImageIcon, Lightbulb, ArrowRight, MousePointer2, GripHorizontal, Copy, Check, Sparkles, BookOpen
} from 'lucide-react';
import { MindNode } from '../../types';
import { TranslationStrings } from '../../i18n';

// NOTE: 使用 lucide-react 的 Image 并重命名为 ImageIcon
import { Image as ImageIconLucide } from 'lucide-react';
import { SimpleMarkdown } from './SimpleMarkdown';

interface ActionCardProps {
    selectedNodes: MindNode[];
    isDarkMode: boolean;
    t: TranslationStrings;
    proposalResult: string | null;
    isGeneratingImage: boolean;
    isGeneratingProposal: boolean;
    hasGoogleApiKey: boolean; // 新增：是否配置了 Google API Key
    onGenerateImage: () => void;
    onGenerateProposal: () => void;
    onClearProposal: () => void;
    onDeleteSelected: () => void;
    onClearSelection: () => void;
    // New props for accessible actions
    onExpand: () => void;
    onExplain: () => void;
}

/**
 * 选中节点操作面板
 * 显示选中节点信息和可用操作
 * 支持通过标题栏拖动
 */
export const ActionCard: React.FC<ActionCardProps> = ({
    selectedNodes,
    isDarkMode,
    t,
    proposalResult,
    isGeneratingImage,
    isGeneratingProposal,
    hasGoogleApiKey,
    onGenerateImage,
    onGenerateProposal,
    onClearProposal,
    onDeleteSelected,
    onClearSelection,
    onExpand,
    onExplain
}) => {
    // 拖动位置状态
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = async () => {
        if (!proposalResult) return;
        try {
            await navigator.clipboard.writeText(proposalResult);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    // 鼠标按下开始拖动
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        // 只响应鼠标左键
        if (e.button !== 0) return;

        e.preventDefault();
        setIsDragging(true);

        const rect = cardRef.current?.getBoundingClientRect();
        if (rect) {
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    }, []);

    // 鼠标移动时更新位置
    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    // 选中节点变化时重置位置
    useEffect(() => {
        if (selectedNodes.length === 0) {
            setPosition(null);
        }
    }, [selectedNodes.length]);

    if (selectedNodes.length === 0) return null;

    // 计算样式：使用自定义位置或默认位置
    const positionStyle = position
        ? { left: position.x, top: position.y }
        : {};

    return (
        <div
            ref={cardRef}
            className={`fixed z-50 w-64 md:w-72 rounded-2xl border shadow-2xl backdrop-blur-xl transition-shadow duration-300 animate-in fade-in slide-in-from-left-4 ${isDragging ? 'shadow-3xl' : ''
                } ${position ? '' : 'top-36 lg:top-24 left-4 md:left-6'
                } ${isDarkMode ? 'bg-[#1F2937]/90 border-gray-700' : 'bg-white/90 border-slate-200/60'
                }`}
            style={positionStyle}
            role="region"
            aria-label="Selected nodes actions"
        >
            {/* 标题栏 - 可拖动区域 */}
            <div
                className={`flex justify-between items-center p-3 border-b border-gray-500/10 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                onMouseDown={handleMouseDown}
            >
                <span className="text-xs font-bold uppercase tracking-wider opacity-50 flex items-center gap-1">
                    <GripHorizontal className="w-3 h-3" aria-hidden="true" />
                    Selection
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={onDeleteSelected}
                        className={`p-1.5 rounded-lg hover:bg-red-500/10 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-slate-400 hover:text-red-500'
                            }`}
                        aria-label="Delete selected nodes"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                        onClick={onClearSelection}
                        className={`p-1.5 rounded-lg hover:bg-gray-500/10 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        aria-label="Clear selection"
                        title="Clear selection"
                    >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                </div>
            </div>

            {/* 内容区 */}
            <div className="p-4">
                {/* 单选显示详情，多选显示数量 */}
                {selectedNodes.length === 1 ? (
                    <div className="mb-4">
                        <h3
                            className="font-bold text-lg truncate leading-tight"
                            title={selectedNodes[0].text}
                        >
                            {selectedNodes[0].text}
                        </h3>
                        <p className="text-xs opacity-60 truncate mt-0.5">
                            {selectedNodes[0].translation}
                        </p>
                    </div>
                ) : (
                    <div className="mb-4">
                        <div className="font-bold mb-2 text-sm opacity-80">
                            {selectedNodes.length} items selected
                        </div>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                            {selectedNodes.map(node => (
                                <span
                                    key={node.id}
                                    className={`text-[10px] px-2 py-1 rounded-md max-w-full truncate ${isDarkMode ? 'bg-gray-700/50 text-gray-300' : 'bg-slate-100 text-slate-700'}`}
                                >
                                    {node.text}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="space-y-2">
                    {/* 主要操作组：扩展与解释 (Row 1 for Single Selection) */}
                    {selectedNodes.length === 1 && !proposalResult && (
                        <div className="flex gap-2">
                            <button
                                onClick={onExpand}
                                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium ${isDarkMode ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600'
                                    }`}
                                title={t.contextMenu.smartExpand}
                            >
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs">{t.contextMenu.smartExpand}</span>
                            </button>
                            <button
                                onClick={onExplain}
                                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium ${isDarkMode ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-600'
                                    }`}
                                title={t.contextMenu.explain}
                            >
                                <BookOpen className="w-4 h-4" />
                                <span className="text-xs">{t.contextMenu.explain}</span>
                            </button>
                        </div>
                    )}

                    {/* 单选时显示生成图像按钮 */}
                    {selectedNodes.length === 1 && !proposalResult && (
                        <div className="relative group">
                            <button
                                onClick={hasGoogleApiKey ? onGenerateImage : undefined}
                                disabled={isGeneratingImage || !hasGoogleApiKey}
                                className={`w-full py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${hasGoogleApiKey
                                    ? `bg-blue-500/10 hover:bg-blue-500/20 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`
                                    : `bg-gray-500/10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`
                                    }`}
                                aria-busy={isGeneratingImage}
                                title={hasGoogleApiKey ? t.generateImage : t.imageGenRequiresGoogle}
                            >
                                {isGeneratingImage
                                    ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                    : <ImageIconLucide className="w-4 h-4" aria-hidden="true" />
                                }
                                {t.generateImage}
                            </button>
                            {/* 未配置 Google API Key 时显示提示 */}
                            {!hasGoogleApiKey && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <div className={`text-[10px] px-2 py-1 rounded whitespace-nowrap ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'}`}>
                                        {t.imageGenRequiresGoogle}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 概念融合 */}
                    {!proposalResult ? (
                        <button
                            onClick={onGenerateProposal}
                            disabled={isGeneratingProposal}
                            className={`w-full py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg flex items-center justify-center gap-2 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                                }`}
                            aria-busy={isGeneratingProposal}
                        >
                            {isGeneratingProposal
                                ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                : <Lightbulb className="w-4 h-4" aria-hidden="true" />
                            }
                            {t.conceptFusion}
                        </button>
                    ) : (
                        <div className="animate-in fade-in zoom-in-95 relative group">
                            <div className={`p-3 rounded-lg border mb-3 text-sm leading-relaxed max-h-60 overflow-y-auto pr-8 ${isDarkMode ? 'bg-black/30 border-gray-700' : 'bg-slate-50 border-slate-200'
                                }`}>
                                <SimpleMarkdown content={proposalResult} isDarkMode={isDarkMode} />
                            </div>

                            <button
                                onClick={handleCopy}
                                className={`absolute top-2 right-2 p-1.5 rounded-lg backdrop-blur-sm transition-all ${isDarkMode
                                    ? 'bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white'
                                    : 'bg-white/50 hover:bg-white text-slate-400 hover:text-slate-700'
                                    }`}
                                aria-label="Copy result"
                                title="Copy"
                            >
                                {hasCopied ? (
                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                )}
                            </button>
                            <button
                                onClick={onClearProposal}
                                className={`w-full py-1.5 text-xs flex justify-center gap-1 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                                    }`}
                            >
                                {t.back}
                                <ArrowRight className="w-3 h-3" aria-hidden="true" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionCard;

