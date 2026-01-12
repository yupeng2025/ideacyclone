import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

/**
 * IdeaCyclone 应用入口
 */
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
