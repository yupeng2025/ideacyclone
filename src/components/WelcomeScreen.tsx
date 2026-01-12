import React from 'react';
import { Sparkles, Lightbulb, Network, Zap } from 'lucide-react';

interface WelcomeScreenProps {
    onStart: () => void;
    isDarkMode: boolean;
    currentLanguage: 'en' | 'zh' | 'ja';
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, isDarkMode, currentLanguage }) => {
    const translations = {
        en: {
            title: 'IdeaCyclone',
            subtitle: 'Transform Your Ideas into Visual Mind Maps',
            description: 'Unleash your creativity with AI-powered brainstorming. Generate, organize, and expand your ideas visually.',
            features: [
                { icon: Sparkles, text: 'AI-Powered Expansion' },
                { icon: Lightbulb, text: 'Creative Ideation' },
                { icon: Network, text: 'Visual Mapping' },
                { icon: Zap, text: 'Instant Insights' }
            ],
            startButton: 'Start Brainstorming'
        },
        zh: {
            title: 'IdeaCyclone',
            subtitle: '将您的想法转化为可视化思维导图',
            description: '利用 AI 驱动的头脑风暴释放您的创造力。生成、组织和扩展您的想法。',
            features: [
                { icon: Sparkles, text: 'AI 智能扩展' },
                { icon: Lightbulb, text: '创意构思' },
                { icon: Network, text: '可视化映射' },
                { icon: Zap, text: '即时洞察' }
            ],
            startButton: '开始头脑风暴'
        },
        ja: {
            title: 'IdeaCyclone',
            subtitle: 'アイデアをビジュアルマインドマップに変換',
            description: 'AI駆動のブレインストーミングで創造性を解放。アイデアを生成、整理、拡張します。',
            features: [
                { icon: Sparkles, text: 'AI スマート拡張' },
                { icon: Lightbulb, text: '創造的発想' },
                { icon: Network, text: 'ビジュアルマッピング' },
                { icon: Zap, text: '瞬時の洞察' }
            ],
            startButton: 'ブレインストーミング開始'
        }
    };

    const t = translations[currentLanguage];

    return (
        <div className={`relative w-full h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* 装饰性背景元素 */}
                <div className={`absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl opacity-20 ${isDarkMode ? 'bg-purple-500' : 'bg-purple-300'}`} />
                <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-300'}`} />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                {/* Logo/Icon */}
                <div className="mb-8 flex justify-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className={`text-6xl font-bold mb-4 bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-gradient-to-r from-purple-600 to-blue-600'}`}>
                    {t.title}
                </h1>

                {/* Subtitle */}
                <p className={`text-2xl mb-6 ${isDarkMode ? 'text-gray-300' : 'text-slate-950'}`}>
                    {t.subtitle}
                </p>

                {/* Description */}
                <p className={`text-lg mb-12 max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-slate-700'}`}>
                    {t.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {t.features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-xl backdrop-blur-sm transition-transform hover:scale-105 ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/60 border border-slate-300'}`}
                            >
                                <Icon className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-slate-700'}`} />
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`}>
                                    {feature.text}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Start Button */}
                <button
                    onClick={onStart}
                    className={`group px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl ${isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {t.startButton}
                        <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </span>
                </button>
            </div>
        </div>
    );
};
