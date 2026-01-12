import React, { useState } from 'react';
import { Layers, X, Copy, Lightbulb } from 'lucide-react';
import { TranslationStrings } from '../../i18n';

interface FloatingPanelProps {
    items: { id: string; text: string }[];
    onRemoveItem: (id: string) => void;
    onClear: () => void;
    onFusion: (items: string[]) => void;
    isDarkMode: boolean;
    t: TranslationStrings;
}

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
    items,
    onRemoveItem,
    onClear,
    onFusion,
    isDarkMode,
    t
}) => {
    const [isOpen, setIsOpen] = useState(true);

    if (items.length === 0) return null;

    return (
        <div
            className={`fixed bottom-24 right-6 z-40 w-72 rounded-xl shadow-2xl border transition-all duration-300 ${isDarkMode ? 'bg-[#1F2937]/95 border-gray-700' : 'bg-white/95 border-slate-200'
                }`}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-3 border-b border-gray-200/10 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Layers className="w-5 h-5 text-blue-500" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-blue-600 text-[8px] text-white">
                            {items.length}
                        </span>
                    </div>
                    <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                        {isOpen ? 'Idea Collector' : 'Collector'}
                    </span>
                </div>

                {isOpen && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onClear(); }}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Content */}
            {isOpen && (
                <div className="p-3 max-h-60 overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className={`group flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-slate-50 hover:bg-slate-100'
                                    }`}
                            >
                                <span className={isDarkMode ? 'text-gray-300' : 'text-slate-700'}>
                                    {item.text}
                                </span>
                                <button
                                    onClick={() => onRemoveItem(item.id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200/10">
                        <button
                            onClick={() => onFusion(items.map(i => i.text))}
                            className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            <Lightbulb className="w-4 h-4" />
                            Start Concept Fusion
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
