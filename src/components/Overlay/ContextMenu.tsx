import React, { useEffect, useRef } from 'react';
import { Trash2, Sparkles, BookOpen } from 'lucide-react';
import { TranslationStrings } from '../../i18n';

interface ContextMenuProps {
    x: number;
    y: number;
    nodeId: string;
    onClose: () => void;
    onDelete: (nodeId: string) => void;
    onExpand: (nodeId: string) => void;
    onExplain: (nodeId: string) => void;
    isDarkMode: boolean;
    t: TranslationStrings;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    x,
    y,
    nodeId,
    onClose,
    onDelete,
    onExpand,
    onExplain,
    isDarkMode,
    t
}) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    // 防止菜单溢出屏幕，向右偏移避免挡住节点
    const style = {
        top: y,
        left: x + 8,
    };

    return (
        <div
            ref={menuRef}
            className={`fixed z-50 min-w-[180px] rounded-lg shadow-xl border overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${isDarkMode
                ? 'bg-[#1F2937] border-gray-700 text-gray-200'
                : 'bg-white border-gray-200 text-gray-700'
                }`}
            style={style}
        >
            <div className="py-1">
                <button
                    onClick={() => { onExpand(nodeId); onClose(); }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>{t.contextMenu.smartExpand}</span>
                </button>
                <div className={`h-px mx-1 my-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                <button
                    onClick={() => { onExplain(nodeId); onClose(); }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                        }`}
                >
                    <BookOpen className="w-4 h-4 text-blue-500" />
                    <span>{t.contextMenu.explain}</span>
                </button>
                <div className={`h-px mx-1 my-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} />
                <button
                    onClick={() => { onDelete(nodeId); onClose(); }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                        }`}
                >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.contextMenu.deleteKeyword}</span>
                </button>
            </div>
        </div>
    );
};
