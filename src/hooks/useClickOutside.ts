import { useEffect, useRef, RefObject } from 'react';

/**
 * 检测点击元素外部的 Hook
 * 用于实现点击外部关闭弹出层的功能
 * 
 * @param ref 需要监测的元素引用
 * @param handler 点击外部时触发的回调函数
 * @param enabled 是否启用监听（默认 true）
 */
export const useClickOutside = <T extends HTMLElement>(
    ref: RefObject<T | null>,
    handler: () => void,
    enabled: boolean = true
): void => {
    // 使用 ref 存储 handler，避免重复绑定
    const handlerRef = useRef(handler);

    // 同步更新 handler ref
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent) => {
            // 检查点击是否在元素外部
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handlerRef.current();
            }
        };

        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handlerRef.current();
            }
        };

        // 使用 mousedown 而非 click，以便在 focus 转移前捕获事件
        // 延迟添加监听器，避免打开时立即触发关闭
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [ref, enabled]);
};

export default useClickOutside;

