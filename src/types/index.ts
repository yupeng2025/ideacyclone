/**
 * 应用核心类型定义
 */

/**
 * 思维导图节点
 */
export interface MindNode {
    id: string;
    text: string;
    explanation: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    vx?: number;
    vy?: number;
    type: 'root' | 'child';
    selected: boolean;
    expanded: boolean;
    loading: boolean;
    parentId?: string;
    imageUrl?: string; // 多模态支持
}

/**
 * 思维导图连接
 */
export interface MindLink {
    source: string | MindNode;
    target: string | MindNode;
}

/**
 * 历史记录项
 */
export interface HistoryItem {
    id: string;
    text: string;
    timestamp: number;
}

/**
 * Gemini API 响应格式
 */
export interface GeminiResponse {
    associations: {
        word: string;
        explanation: string;
    }[];
}

/**
 * 应用状态快照 (用于撤销/重做)
 */
export interface AppStateSnapshot {
    nodes: MindNode[];
    links: MindLink[];
}

/**
 * 头脑风暴模式类型
 */
export type PersonaType = 'standard' | 'creative' | 'logic' | 'business' | 'poetic';

/**
 * 支持的语言
 */
export type Language = 'zh' | 'en' | 'ja';
