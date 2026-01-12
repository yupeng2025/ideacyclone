import React from 'react';
import { Sparkles, X, Info } from 'lucide-react';

/**
 * Toast 消息类型
 */
export interface ToastMsg {
    id: string;
    type: 'success' | 'error' | 'info';
    text: string;
}

interface ToastContainerProps {
    toasts: ToastMsg[];
    removeToast: (id: string) => void;
}

/**
 * Toast 通知容器组件
 * 显示应用内的提示消息
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
    return (
        <div
            className="fixed top-24 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
            role="region"
            aria-label="Notifications"
            aria-live="polite"
        >
            {toasts.map(t => (
                <div
                    key={t.id}
                    role="alert"
                    className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border animate-in slide-in-from-right-10 fade-in duration-300 ${t.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800' :
                            t.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800' :
                                'bg-white/90 border-gray-200 text-gray-800'
                        }`}
                >
                    {t.type === 'error' ? (
                        <X className="w-4 h-4 text-red-500" aria-hidden="true" />
                    ) : t.type === 'success' ? (
                        <Sparkles className="w-4 h-4 text-green-500" aria-hidden="true" />
                    ) : (
                        <Info className="w-4 h-4 text-blue-500" aria-hidden="true" />
                    )}
                    <span className="text-sm font-medium">{t.text}</span>
                    <button
                        onClick={() => removeToast(t.id)}
                        className="ml-2 p-1 rounded hover:bg-black/10 transition-colors"
                        aria-label="Dismiss notification"
                    >
                        <X className="w-3 h-3" aria-hidden="true" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
