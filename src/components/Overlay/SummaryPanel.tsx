import React, { useState } from 'react';
import { X, Copy, Check, Sparkles } from 'lucide-react';
import { SimpleMarkdown } from '../ActionCard/SimpleMarkdown';
import { TranslationStrings } from '../../i18n';

interface SummaryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    content: string;
    isDarkMode: boolean;
    t: TranslationStrings;
    title?: string;
}

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
    isOpen,
    onClose,
    content,
    isDarkMode,
    t,
    title
}) => {
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100 ${isDarkMode ? 'bg-[#1F2937] border border-gray-700' : 'bg-white border border-slate-200'
                }`}>
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-slate-100 bg-slate-50/80'
                    }`}>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {title || t.aiSummary?.title || "AI Summary"}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-1 rounded-full transition-colors ${isDarkMode
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                            : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                            }`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className={`p-6 max-h-[60vh] overflow-y-auto custom-scrollbar ${isDarkMode ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                    <div className="prose prose-sm max-w-none leading-relaxed font-sans">
                        <SimpleMarkdown content={content} isDarkMode={isDarkMode} />
                    </div>
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 flex justify-end items-center gap-3 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-slate-100 bg-slate-50/80'
                    }`}>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isCopied
                            ? 'bg-green-500/10 text-green-500'
                            : isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                    >
                        {isCopied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Copy Text</span>
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
