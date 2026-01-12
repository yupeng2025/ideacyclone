import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { HeroWordCloud } from './HeroWordCloud';

interface InitialLandingProps {
    inputText: string;
    onInputChange: (text: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isProcessing: boolean;
    isDarkMode: boolean;
    placeholder: string;
    subtitle: string; // 副标题文本
    currentLanguage: 'en' | 'zh' | 'ja';
}

export const InitialLanding: React.FC<InitialLandingProps> = ({
    inputText,
    onInputChange,
    onSubmit,
    isProcessing,
    isDarkMode,
    placeholder,
    subtitle,
    currentLanguage
}) => {
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(1);
    const [lastVolume, setLastVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
        }
        setIsMuted(newVolume === 0);
        if (newVolume > 0) {
            setLastVolume(newVolume);
        }
    };

    const toggleMute = () => {
        if (isMuted) {
            const newVolume = lastVolume || 1;
            setVolume(newVolume);
            setIsMuted(false);
            if (videoRef.current) {
                videoRef.current.volume = newVolume;
                videoRef.current.muted = false;
            }
        } else {
            setLastVolume(volume);
            setVolume(0);
            setIsMuted(true);
            if (videoRef.current) {
                videoRef.current.volume = 0;
                videoRef.current.muted = true;
            }
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'bg-[#111827]' : 'bg-gray-50'}`}>
            <div className="w-full max-w-2xl px-8 relative">
                {/* Brand Animation */}
                <div className="flex justify-center mb-12 relative z-10">
                    <div className="relative inline-block group">
                        <video
                            ref={videoRef}
                            src="IdeaCyclone.mp4"
                            autoPlay
                            loop
                            muted={isMuted}
                            playsInline
                            className="w-full max-w-[300px] md:max-w-[400px] object-contain rounded-lg"
                        />

                        <div className={`absolute bottom-2 right-2 flex items-center gap-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 ${isDarkMode
                            ? 'bg-black/40 hover:bg-black/60 text-white'
                            : 'bg-white/40 hover:bg-white/60 text-gray-800'
                            } pr-2 pl-2`}>

                            {/* Play/Pause Button */}
                            <button
                                onClick={togglePlay}
                                className="flex-shrink-0 focus:outline-none p-1 hover:bg-white/10 rounded-full transition-colors"
                                aria-label={isPlaying ? "Pause video" : "Play video"}
                            >
                                {isPlaying ? (
                                    <Pause className="w-4 h-4" />
                                ) : (
                                    <Play className="w-4 h-4" />
                                )}
                            </button>

                            {/* Divider */}
                            <div className={`w-px h-4 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>

                            {/* Volume Control */}
                            <div className="flex items-center">
                                <div className="w-0 overflow-hidden group-hover:w-20 transition-[width] duration-300 ease-out flex items-center">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className={`w-16 h-1 mx-2 rounded-full appearance-none cursor-pointer ${isDarkMode ? 'bg-gray-600 accent-white' : 'bg-gray-300 accent-gray-800'
                                            }`}
                                    />
                                </div>

                                <button
                                    onClick={toggleMute}
                                    className="flex-shrink-0 focus:outline-none p-1 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX className="w-4 h-4" />
                                    ) : (
                                        <Volume2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Word Cloud */}
                <HeroWordCloud
                    isDarkMode={isDarkMode}
                    currentLanguage={currentLanguage}
                    onWordClick={onInputChange}
                />

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-bold text-center mb-3">
                    <span className={isDarkMode ? 'text-white' : 'text-black'}>Idea</span>
                    <span className="text-cyan-400">Cyclone</span>
                </h1>

                {/* Subtitle */}
                <p className={`text-center text-lg mb-12 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    {subtitle}
                </p>

                {/* Input Form */}
                <form onSubmit={onSubmit} className="w-full">
                    {/* Glowing Border Container */}
                    <div className="relative group rounded-full p-[2px] overflow-hidden">
                        {/* Moving Gradient - distinct colors for light/dark modes */}
                        <div className={`absolute inset-[-100%] animate-[spin_3s_linear_infinite] ${isDarkMode
                            ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#111827_0%,#5eead4_50%,#111827_100%)]'
                            : 'bg-[conic-gradient(from_90deg_at_50%_50%,#f9fafb_0%,#0ea5e9_50%,#f9fafb_100%)]'
                            }`} />

                        {/* Input Content */}
                        <div className={`relative flex items-center rounded-full border h-full w-full ${isDarkMode
                            ? 'bg-gray-900 border-transparent'
                            : 'bg-white border-transparent'
                            } backdrop-blur-sm shadow-lg`}>
                            <div className={`absolute left-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => onInputChange(e.target.value)}
                                placeholder={placeholder}
                                disabled={isProcessing}
                                className={`w-full pl-14 pr-6 py-4 bg-transparent outline-none text-base relative z-10 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-gray-500'
                                    }`}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
