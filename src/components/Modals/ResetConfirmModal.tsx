import React, { useRef, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TranslationStrings } from '../../i18n';
import { useClickOutside } from '../../hooks';

interface ResetConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDarkMode: boolean;
    t: TranslationStrings;
}

/**
 * 重置确认模态框
 * 确认用户是否要清空画布
 */
export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isDarkMode,
    t
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const cancelButtonRef = useRef<HTMLButtonElement>(null);

    // 点击外部关闭
    useClickOutside(modalRef, onClose, isOpen);

    // 打开时聚焦取消按钮
    useEffect(() => {
        if (isOpen && cancelButtonRef.current) {
            cancelButtonRef.current.focus();
        }
    }, [isOpen]);

    // 阻止滚动
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
            aria-describedby="reset-modal-description"
        >
            <div
                ref={modalRef}
                className={`relative w-full max-w-sm rounded-3xl shadow-2xl border p-6 animate-in zoom-in-95 duration-200 ${isDarkMode
                    ? 'bg-[#1F2937] border-gray-700 text-white'
                    : 'bg-white border-slate-100 text-slate-900'
                    }`}
            >
                <div className="flex flex-col items-center text-center gap-4">
                    {/* 警告图标 */}
                    <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full text-red-500">
                        <AlertTriangle className="w-8 h-8" aria-hidden="true" />
                    </div>

                    {/* 标题 */}
                    <h3 id="reset-modal-title" className="text-xl font-bold">
                        {t.project.resetConfirmTitle}
                    </h3>

                    {/* 描述 */}
                    <p
                        id="reset-modal-description"
                        className={`text-sm opacity-80 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}
                    >
                        {t.project.resetConfirm}
                    </p>

                    {/* 按钮组 */}
                    <div className="flex gap-3 w-full mt-2">
                        <button
                            ref={cancelButtonRef}
                            onClick={onClose}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDarkMode
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                                }`}
                        >
                            {t.project.cancel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
                        >
                            {t.project.confirm}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetConfirmModal;
