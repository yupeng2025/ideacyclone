import { useState, useCallback, useEffect } from 'react';

/**
 * LocalStorage 操作封装 Hook
 * 提供类型安全的本地存储读写功能
 * 
 * @param key 存储键名
 * @param initialValue 初始值
 * @returns [存储值, 设置函数, 移除函数]
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // 获取初始值
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // 设置值
    const setValue = useCallback((value: T | ((prev: T) => T)) => {
        try {
            // 支持函数式更新
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // 移除值
    const removeValue = useCallback(() => {
        try {
            setStoredValue(initialValue);
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (error) {
            console.warn(`Error removing localStorage key "${key}":`, error);
        }
    }, [key, initialValue]);

    // 监听其他标签页的存储变化
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch {
                    // 忽略解析错误
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
