/* eslint-disable react-hooks/set-state-in-effect */
// hooks/usePWAInstall.js
import { useState, useEffect } from 'react';

const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Detectar si ya está instalada (modo standalone)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        setIsInstalled(isStandalone);

        // Escuchar el evento beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        // Escuchar cuando se completa la instalación
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) return;

        try {
            // Mostrar el prompt de instalación
            await deferredPrompt.prompt();

            // Esperar la respuesta del usuario
            const result = await deferredPrompt.userChoice;

            if (result.outcome === 'accepted') {
                console.log('PWA instalada exitosamente');
                setIsInstalled(true);
                setIsInstallable(false);
            } else {
                console.log('Usuario rechazó la instalación');
            }
        } catch (error) {
            console.error('Error al instalar PWA:', error);
        } finally {
            // El prompt solo se puede usar una vez
            setDeferredPrompt(null);
        }
    };

    return { isInstallable, isInstalled, installApp };
};

export default usePWAInstall;