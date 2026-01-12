export interface MindNode {
  id: string;
  text: string;
  translation: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  type: 'root' | 'child';
  selected: boolean;
  expanded: boolean;
  loading: boolean;
  parentId?: string;
  imageUrl?: string; // Multimodal support
}

export interface MindLink {
  source: string | MindNode;
  target: string | MindNode;
}

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
}

export interface GeminiResponse {
  associations: {
    word: string;
    translation: string;
  }[];
}

export type PersonaType = 'standard' | 'creative' | 'logic' | 'business' | 'poetic';

export type Language = 'zh' | 'en' | 'ja';
