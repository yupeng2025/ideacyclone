import React from 'react';

interface SimpleMarkdownProps {
    content: string;
    isDarkMode: boolean;
}

export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content, isDarkMode }) => {
    // Process text for bold styling (**text**)
    const renderText = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];

    let listItems: React.ReactNode[] = [];
    let inList = false;

    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="list-disc pl-5 mb-2 space-y-1">{listItems}</ul>);
                listItems = [];
                inList = false;
            }
            return;
        }

        if (trimmed.startsWith('# ')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="list-disc pl-5 mb-2 space-y-1">{listItems}</ul>);
                listItems = [];
                inList = false;
            }
            elements.push(<h3 key={i} className="text-lg font-bold mb-2 mt-4 first:mt-0">{renderText(trimmed.slice(2))}</h3>);
        } else if (trimmed.startsWith('## ')) {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="list-disc pl-5 mb-2 space-y-1">{listItems}</ul>);
                listItems = [];
                inList = false;
            }
            elements.push(<h4 key={i} className={`text-base font-bold mb-1 mt-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{renderText(trimmed.slice(3))}</h4>);
        } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            inList = true;
            listItems.push(<li key={i}>{renderText(trimmed.slice(2))}</li>);
        } else {
            if (inList) {
                elements.push(<ul key={`list-${i}`} className="list-disc pl-5 mb-2 space-y-1">{listItems}</ul>);
                listItems = [];
                inList = false;
            }
            elements.push(<p key={i} className="mb-2 last:mb-0">{renderText(trimmed)}</p>);
        }
    });

    if (inList) {
        elements.push(<ul key="list-end" className="list-disc pl-5 mb-2 space-y-1">{listItems}</ul>);
    }

    return <div className="text-sm leading-relaxed">{elements}</div>;
};
