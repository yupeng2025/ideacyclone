import React from 'react';
import { Moon, Sun, Settings, BookOpen } from 'lucide-react';
import { TranslationStrings } from '../../i18n';
import { PersonaType, Language } from '../../types';

interface TopControlsProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
    currentPersona: PersonaType;
    onChangePersona: () => void;
    currentLanguage: Language;
    onChangeLanguage: () => void;
    isSettingsOpen: boolean;
    onToggleSettings: () => void;
    onOpenGuide: () => void;
    t: TranslationStrings;
    hasApiKey: boolean; // 新增：是否已配置 API Key
}

// 语言标签映射
const LANGUAGE_LABELS: Record<Language, string> = {
    en: '英',
    zh: '中',
    ja: '日'
};

/**
 * 顶部控制栏组件
 * 包含使用指南按钮、模式切换、语言切换、主题切换和设置按钮
 */
export const TopControls: React.FC<TopControlsProps> = ({
    isDarkMode,
    onToggleTheme,
    currentPersona,
    onChangePersona,
    currentLanguage,
    onChangeLanguage,
    isSettingsOpen,
    onToggleSettings,
    onOpenGuide,
    t,
    hasApiKey
}) => {
    // 根据模式获取指示器颜色
    const getPersonaColor = () => {
        switch (currentPersona) {
            case 'creative': return 'bg-purple-500';
            case 'logic': return 'bg-blue-500';
            case 'business': return 'bg-green-500';
            case 'poetic': return 'bg-pink-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <>
            {/* 左上角使用指南按钮 */}
            <button
                onClick={onOpenGuide}
                className={`fixed top-4 md:top-6 left-2 md:left-6 z-50 flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${isDarkMode
                    ? 'bg-[#1F2937]/90 border-gray-700 text-gray-300 hover:text-white'
                    : 'bg-white/90 border-slate-300 text-slate-700 hover:text-black'
                    }`}
                aria-label={t.aria.guideBtn}
                title={t.guide.btn}
            >
                <BookOpen
                    className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}
                    aria-hidden="true"
                />
                <span className="hidden lg:inline text-sm font-medium">{t.guide.btn}</span>
            </button>

            {/* 右上角控制组 - 移动端更紧凑 */}
            <div className="fixed top-4 lg:top-6 right-2 lg:right-6 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    {/* 移动端：单一紧凑按钮组 */}
                    <div className={`flex items-center rounded-full p-0.5 lg:p-1 border shadow-lg backdrop-blur-md ${isDarkMode ? 'bg-[#1F2937]/80 border-gray-700' : 'bg-white/70 border-white/50'
                        }`}>
                        {/* 模式切换 - 移动端只显示圆点 */}
                        <button
                            onClick={onChangePersona}
                            className={`relative group p-1.5 lg:px-3 lg:py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 lg:gap-2 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-200'
                                }`}
                            aria-label={t.aria.modeSelector}
                            aria-pressed="false"
                            title={t.aria.modeSelector}
                        >
                            <span
                                className={`w-2 h-2 rounded-full ${getPersonaColor()}`}
                                aria-hidden="true"
                            />
                            {/* Desktop text - Made visible on mobile but smaller */}
                            <span className="text-[10px] lg:text-xs lg:inline">{t.modes[currentPersona]}</span>

                            {/* Hover Hint Bubble */}
                            <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isDarkMode ? 'bg-gray-800 text-gray-200 shadow-xl border border-gray-700' : 'bg-white text-slate-600 shadow-xl border border-slate-100'
                                }`}>
                                Switch Expert
                            </div>
                        </button>

                        {/* 分隔线 - 移动端隐藏 */}
                        <div className="hidden lg:block w-[1px] h-4 bg-gray-500/20 mx-1" aria-hidden="true" />

                        {/* 语言切换 - 移动端更紧凑 */}
                        <button
                            onClick={onChangeLanguage}
                            className={`px-1.5 lg:px-3 py-1 lg:py-1.5 rounded-full text-[10px] lg:text-xs font-bold transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-200'
                                }`}
                            aria-label={t.aria.langSelector}
                            title={t.aria.langSelector}
                        >
                            {currentLanguage.toUpperCase()}
                        </button>

                        {/* 分隔线 */}
                        <div className="w-[1px] h-3 lg:h-4 bg-gray-500/20 mx-0.5 lg:mx-1" aria-hidden="true" />

                        {/* 主题切换 */}
                        <button
                            onClick={onToggleTheme}
                            className={`p-1 lg:p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-200 text-slate-700'
                                }`}
                            aria-label={t.aria.themeToggle}
                            aria-pressed={isDarkMode}
                            title={t.aria.themeToggle}
                        >
                            {isDarkMode
                                ? <Sun className="w-3 h-3 lg:w-4 lg:h-4" aria-hidden="true" />
                                : <Moon className="w-3 h-3 lg:w-4 lg:h-4" aria-hidden="true" />
                            }
                        </button>

                        {/* 设置按钮 - 带 API 状态指示灯 */}
                        <button
                            onClick={onToggleSettings}
                            className={`p-1 lg:p-2 rounded-full transition-colors relative ${isSettingsOpen ? 'text-cyan-400' : ''
                                } ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'}`}
                            aria-label={t.aria.settingsBtn}
                            aria-expanded={isSettingsOpen}
                            title={t.settings}
                        >
                            <Settings className="w-3 h-3 lg:w-4 lg:h-4" aria-hidden="true" />
                            {/* API 状态指示灯 */}
                            <span
                                className={`absolute -top-0.5 -right-0.5 lg:top-0.5 lg:right-0.5 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full border ${isDarkMode ? 'border-gray-800' : 'border-white'} ${hasApiKey ? 'bg-cyan-400' : 'bg-red-500'}`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopControls;
