import React, { useState, useMemo } from 'react';
import { Search, X, Crosshair } from 'lucide-react';
import { MindNode } from '../../types';
import { TranslationStrings } from '../../i18n';

interface SearchPanelProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: MindNode[];
    onNodeClick: (nodeId: string) => void;
    isDarkMode: boolean;
    t: TranslationStrings;
    className?: string; // Add className prop
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
    isOpen,
    onClose,
    nodes,
    onNodeClick,
    isDarkMode,
    t,
    className
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNodes = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const term = searchTerm.toLowerCase();
        return nodes.filter(n =>
            n.text.toLowerCase().includes(term) ||
            (n.explanation && n.explanation.toLowerCase().includes(term))
        );
    }, [nodes, searchTerm]);

    if (!isOpen) return null;

    return (
        <div className={className || `fixed bottom-24 left-6 z-40 w-80 rounded-xl shadow-2xl border transition-all duration-300 flex flex-col max-h-[60vh] ${isDarkMode ? 'bg-[#1F2937]/95 border-gray-700' : 'bg-white/95 border-slate-200'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-500/10">
                <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                        Search
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Input */}
            <div className="p-3">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder || "Search nodes..."}
                    className={`w-full px-3 py-2 rounded-lg text-sm outline-none border transition-colors ${isDarkMode
                        ? 'bg-gray-800 border-gray-600 focus:border-blue-500 text-white placeholder-gray-500'
                        : 'bg-slate-50 border-gray-200 focus:border-blue-500 text-slate-900 placeholder-gray-400'
                        }`}
                    autoFocus
                />
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pt-0">
                {!searchTerm ? (
                    <div className={`text-center py-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        Type to search...
                    </div>
                ) : filteredNodes.length === 0 ? (
                    <div className={`text-center py-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        No results found
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filteredNodes.map(node => (
                            <button
                                key={node.id}
                                onClick={() => {
                                    onNodeClick(node.id);
                                    onClose();
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left group transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className={`text-sm truncate font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                                        {node.text}
                                    </div>
                                    {node.explanation && (
                                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                                            {node.explanation}
                                        </div>
                                    )}
                                </div>
                                <Crosshair className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 ml-2 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={`text-[10px] px-3 py-2 border-t border-gray-500/10 text-right ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                {filteredNodes.length} results
            </div>
        </div>
    );
};
