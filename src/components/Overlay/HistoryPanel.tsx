import React from 'react';
import { History, X, Clock, Reply } from 'lucide-react';
import { HistoryItem } from '../../types';
import { TranslationStrings } from '../../i18n';

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    historyItems: HistoryItem[];
    onRestore: (text: string) => void;
    isDarkMode: boolean;
    t: TranslationStrings;
    className?: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
    isOpen,
    onClose,
    historyItems,
    onRestore,
    isDarkMode,
    t,
    className
}) => {
    if (!isOpen) return null;

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={className || `fixed bottom-24 left-6 z-40 w-72 rounded-xl shadow-2xl border transition-all duration-300 flex flex-col max-h-[60vh] ${isDarkMode ? 'bg-[#1F2937]/95 border-gray-700' : 'bg-white/95 border-slate-200'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-500/10">
                <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-500" />
                    <span className={`font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                        History
                    </span>
                </div>
                <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                {historyItems.length === 0 ? (
                    <div className={`text-center py-4 text-xs ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                        No history yet
                    </div>
                ) : (
                    <div className="space-y-1">
                        {historyItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    onRestore(item.text);
                                    onClose();
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-left group transition-colors ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Clock className={`w-3 h-3 flex-shrink-0 ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`} />
                                    <span className={`text-sm truncate font-medium ${isDarkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                                        {item.text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                                        {formatTime(item.timestamp)}
                                    </span>
                                    <Reply className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 flex-shrink-0" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={`text-[10px] px-3 py-2 border-t border-gray-500/10 text-right ${isDarkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                {historyItems.length} items
            </div>
        </div>
    );
};
