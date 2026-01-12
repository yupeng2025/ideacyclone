import React, { useEffect, useState, useMemo } from 'react';

type Language = 'en' | 'zh' | 'ja';

interface HeroWordCloudProps {
    isDarkMode: boolean;
    currentLanguage?: Language;
    onWordClick?: (word: string) => void;
}

// Full dictionary
const DICTIONARY = [
    // Marketing
    { en: "Marketing", zh: "市场营销", ja: "マーケティング" },
    { en: "SEO", zh: "SEO", ja: "SEO" },
    { en: "Branding", zh: "品牌", ja: "ブランディング" },
    { en: "Strategy", zh: "策略", ja: "戦略" },
    { en: "Content", zh: "内容", ja: "コンテンツ" },
    { en: "Social Media", zh: "社交媒体", ja: "SNS" },
    { en: "Growth", zh: "增长", ja: "グロース" },
    { en: "Analytics", zh: "分析", ja: "分析" },
    { en: "Funnel", zh: "漏斗", ja: "ファネル" },
    { en: "Campaign", zh: "活动", ja: "キャンペーン" },
    // Design
    { en: "Design", zh: "设计", ja: "デザイン" },
    { en: "UI", zh: "UI", ja: "UI" },
    { en: "UX", zh: "UX", ja: "UX" },
    { en: "Web", zh: "Web", ja: "Web" },
    { en: "Graphic", zh: "平面", ja: "グラフィック" },
    { en: "Creative", zh: "创意", ja: "クリエイティブ" },
    { en: "Typography", zh: "排版", ja: "タイポグラフィ" },
    { en: "Color", zh: "色彩", ja: "カラー" },
    { en: "Layout", zh: "布局", ja: "レイアウト" },
    { en: "Visual", zh: "视觉", ja: "ビジュアル" },
    // Programming
    { en: "Programming", zh: "编程", ja: "プログラミング" },
    { en: "Code", zh: "代码", ja: "コード" },
    { en: "JavaScript", zh: "JavaScript", ja: "JavaScript" },
    { en: "HTML", zh: "HTML", ja: "HTML" },
    { en: "CSS", zh: "CSS", ja: "CSS" },
    { en: "React", zh: "React", ja: "React" },
    { en: "Python", zh: "Python", ja: "Python" },
    { en: "Developer", zh: "开发者", ja: "開発者" },
    { en: "API", zh: "API", ja: "API" },
    { en: "Git", zh: "Git", ja: "Git" },
    // Gaming
    { en: "Gaming", zh: "游戏", ja: "ゲーム" },
    { en: "Unity", zh: "Unity", ja: "Unity" },
    { en: "Unreal", zh: "Unreal", ja: "Unreal" },
    { en: "RPG", zh: "RPG", ja: "RPG" },
    { en: "Esports", zh: "电竞", ja: "eスポーツ" },
    { en: "Console", zh: "主机", ja: "コンソール" },
    { en: "Mobile", zh: "移动", ja: "モバイル" },
    { en: "Multiplayer", zh: "多人", ja: "マルチプレイ" },
    { en: "Level Design", zh: "关卡设计", ja: "レベルデザイン" },
    { en: "Graphics", zh: "图形", ja: "グラフィックス" },
    // Travel
    { en: "Travel", zh: "旅游", ja: "旅行" },
    { en: "Tourism", zh: "观光", ja: "観光" },
    { en: "Adventure", zh: "探险", ja: "冒険" },
    { en: "Destination", zh: "目的地", ja: "目的地" },
    { en: "Hotel", zh: "酒店", ja: "ホテル" },
    { en: "Flight", zh: "航班", ja: "フライト" },
    { en: "Culture", zh: "文化", ja: "文化" },
    { en: "Explore", zh: "探索", ja: "探索" },
    { en: "Vacation", zh: "假期", ja: "休暇" },
    { en: "Trip", zh: "旅行", ja: "旅" },
    // News
    { en: "News", zh: "新闻", ja: "ニュース" },
    { en: "Journalism", zh: "新闻业", ja: "ジャーナリズム" },
    { en: "Media", zh: "媒体", ja: "メディア" },
    { en: "Broadcast", zh: "广播", ja: "放送" },
    { en: "Report", zh: "报道", ja: "報道" },
    { en: "Headlines", zh: "头条", ja: "ヘッドライン" },
    { en: "Article", zh: "文章", ja: "記事" },
    { en: "Global", zh: "全球", ja: "グローバル" },
    { en: "Updates", zh: "更新", ja: "更新" },
    { en: "Current Events", zh: "时事", ja: "時事" },
    // Language
    { en: "Language", zh: "语言", ja: "言語" },
    { en: "Translation", zh: "翻译", ja: "翻訳" },
    { en: "Linguistics", zh: "语言学", ja: "言語学" },
    { en: "Learning", zh: "学习", ja: "学習" },
    { en: "Speech", zh: "演讲", ja: "スピーチ" },
    { en: "Vocabulary", zh: "词汇", ja: "語彙" },
    { en: "Grammar", zh: "语法", ja: "文法" },
    { en: "Communication", zh: "沟通", ja: "コミュニケーション" },
    { en: "English", zh: "英语", ja: "英語" },
    // AI
    { en: "AI", zh: "AI", ja: "AI" },
    { en: "Artificial Intelligence", zh: "人工智能", ja: "人工知能" },
    { en: "Machine Learning", zh: "机器学习", ja: "機械学習" },
    { en: "Neural Network", zh: "神经网络", ja: "ニューラルネット" },
    { en: "ChatGPT", zh: "ChatGPT", ja: "ChatGPT" },
    { en: "Gemini", zh: "Gemini", ja: "Gemini" },
    { en: "LLM", zh: "大模型", ja: "LLM" },
    { en: "Automation", zh: "自动化", ja: "自動化" },
    { en: "Data", zh: "数据", ja: "データ" },
    { en: "Future", zh: "未来", ja: "未来" },
    { en: "Innovation", zh: "创新", ja: "イノベーション" },
    { en: "Technology", zh: "科技", ja: "テクノロジー" },
    { en: "Digital", zh: "数字", ja: "デジタル" },
    { en: "Business", zh: "商业", ja: "ビジネス" },
    { en: "Development", zh: "开发", ja: "開発" }
];

// Predefined positions using a concentric circle layout
// Spread out to avoid overlaps. Center (50, 50).
const POSITIONS = [
    // Center core (Largest)
    { x: 50, y: 48, size: 2.4 },

    // Inner Ring (Push out slightly to accommodate larger center)
    { x: 30, y: 36, size: 1.1 }, { x: 70, y: 36, size: 1.2 },
    { x: 28, y: 62, size: 1.0 }, { x: 72, y: 62, size: 1.3 },
    { x: 50, y: 20, size: 1.2 }, { x: 50, y: 80, size: 1.1 },

    // Middle Ring (radius ~25-30%)
    { x: 20, y: 45, size: 0.9 }, { x: 80, y: 45, size: 1.0 },
    { x: 25, y: 25, size: 1.0 }, { x: 75, y: 25, size: 1.1 },
    { x: 25, y: 75, size: 0.9 }, { x: 75, y: 75, size: 1.2 },

    // Outer Ring (radius ~35-40%) - Constrained to safe zone (15-85)
    { x: 18, y: 15, size: 0.8 }, { x: 82, y: 15, size: 0.9 },
    { x: 12, y: 55, size: 0.8 }, { x: 88, y: 55, size: 0.9 }, // Still slightly wide but smaller text
    { x: 40, y: 10, size: 0.8 }, { x: 60, y: 10, size: 0.8 },
    { x: 40, y: 90, size: 0.8 }, { x: 60, y: 90, size: 0.8 }
];

export const HeroWordCloud: React.FC<HeroWordCloudProps> = ({ isDarkMode, currentLanguage = 'en', onWordClick }) => {
    // Mobile detection for scaling
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            setScale(window.innerWidth < 768 ? 0.6 : 1);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Select a random subset of words consistent across renders (until refresh or lang change)
    // Actually, we want them to change on refresh to be dynamic?
    // Let's pick random words from DICTIONARY to fill POSITIONS.
    // Use useMemo to prevent flickering on re-render unless dependency changes.
    // Memoize the words AND their random animation parameters
    const activeWords = useMemo(() => {
        // Use a seeded random or just random once per mount/lang change
        const shuffled = [...DICTIONARY].sort(() => 0.5 - Math.random());
        return POSITIONS.map((pos, i) => ({
            ...pos,
            text: shuffled[i % shuffled.length][currentLanguage],
            duration: 15 + Math.random() * 10,
            delay: -Math.random() * 20
        }));
    }, [currentLanguage]);

    return (
        <div className="relative w-full h-40 md:h-64 mb-4 overflow-hidden pointer-events-none select-none">
            {activeWords.map((word, index) => (
                <button
                    key={index}
                    onClick={() => onWordClick?.(word.text)}
                    className="absolute whitespace-nowrap text-gray-400 hover:text-blue-500 transition-colors duration-300 font-medium px-4 py-2 rounded-full cursor-pointer pointer-events-auto hover:scale-110 focus:scale-110 active:scale-95 outline-none font-bold z-10"
                    aria-label={`Select ${word.text}`}
                    style={{
                        left: `${word.x}%`,
                        top: `${word.y}%`,
                        fontSize: `${Math.max(0.8, word.size * scale)}rem`,
                        opacity: 0.6, // Start slightly visible
                        animationName: 'float',
                        animationDuration: `${word.duration}s`, // Stable duration
                        animationDelay: `${word.delay}s`, // Stable delay
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'ease-in-out',
                        transform: 'translate(-50%, -50%)',
                        // Pause animation on hover
                        // animationPlayState: 'running' // Handled by CSS usually or hover class
                    }}
                >
                    {word.text}
                </button>
            ))}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
                    50% { transform: translate(-50%, -50%) translateY(-15px); }
                }
                div:hover button {
                    animation-play-state: paused;
                }
                button:hover {
                    z-index: 50;
                }
            `}</style>
        </div>
    );
};
