// CSS & bootstrap bawaan Laravel
import '../css/app.css';
import './bootstrap';
import AppToaster from './Components/ui/toaster';

// Inertia React
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Ziggy v2 (named import, bukan default!)
import { route } from 'ziggy-js';
// Jadikan global supaya bisa pakai route() di mana pun
window.route = (name, params, absolute) => route(name, params, absolute, window.Ziggy);

// (Opsional) Toaster Sonner — aktifkan kalau sudah buat komponennya
// import AppToaster from "./Components/ui/toaster";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * SIMPLE & STABLE: eager-resolve semua Pages
 * (menghindari “Page not found” saat dev)
 */
const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const key = `./Pages/${name}.jsx`;
        const page = pages[key];
        if (!page) {
            console.error('[resolve] not found:', key, 'available:', Object.keys(pages));
            throw new Error(`Page not found: ${key}`);
        }
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <>
                <AppToaster />
                <App {...props} />
            </>,
        );
    },
    progress: { color: '#4B5563' },
});
