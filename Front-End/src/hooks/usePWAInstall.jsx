/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';

const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Detectar si ya está instalada
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setIsInstalled(isStandalone);

        // Si ya está instalada, no mostrar botón
        if (isStandalone) {
            return;
        }

        // Función para verificar si el service worker está registrado
        const checkServiceWorker = async () => {
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    return registrations.length > 0;
                }
                return false;
            } catch (error) {
                console.error('Error checking service worker:', error);
                return false;
            }
        };

        // Función para intentar forzar el registro del SW
        const ensureServiceWorker = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    // Intentar registrar el SW si no está registrado
                    const registration = await navigator.serviceWorker.register('/sw.js', {
                        scope: '/'
                    });
                    console.log('Service Worker registrado:', registration);
                    return true;
                } catch (error) {
                    console.error('Error registrando Service Worker:', error);
                    return false;
                }
            }
            return false;
        };

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

        // Configurar listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Verificar y forzar registro del SW
        const initSW = async () => {
            const hasSW = await checkServiceWorker();
            if (!hasSW) {
                console.log('Service Worker no encontrado, intentando registrar...');
                const registered = await ensureServiceWorker();
                if (registered) {
                    // Esperar un momento y verificar nuevamente
                    setTimeout(async () => {
                        const hasSWNow = await checkServiceWorker();
                        if (hasSWNow) {
                            console.log('Service Worker registrado exitosamente');
                            // Disparar evento manual para verificar instalación
                            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                                // El SW está activo, posiblemente mostrar botón
                                setIsInstallable(true);
                            }
                        }
                    }, 2000);
                }
            } else {
                console.log('Service Worker ya está registrado');
                // Si hay un SW pero no hay evento beforeinstallprompt,
                // verificar si el usuario puede instalar
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                    setTimeout(() => {
                        // Después de un tiempo, si no hay evento, intentar verificar
                        if (!deferredPrompt && !isInstalled) {
                            // Verificar si es Chrome/Edge y debería ser instalable
                            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
                            const isEdge = /Edg/.test(navigator.userAgent);
                            if (isChrome || isEdge) {
                                // Mostrar botón con mensaje específico
                                setIsInstallable(true);
                            }
                        }
                    }, 3000);
                }
            }
        };

        initSW();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const installApp = async () => {
        if (!deferredPrompt) {
            const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
            if (isIOS) {
                return 'manual-ios';
            }

            // Verificar si el navegador soporta instalación
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            const isEdge = /Edg/.test(navigator.userAgent);

            if (isChrome || isEdge) {
                return 'manual-browser';
            }

            return 'unavailable';
        }

        try {
            await deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;

            if (result.outcome === 'accepted') {
                console.log('PWA instalada exitosamente');
                setIsInstalled(true);
                setIsInstallable(false);
                return 'accepted';
            } else {
                console.log('Usuario rechazó la instalación');
                return 'dismissed';
            }
        } catch (error) {
            console.error('Error al instalar PWA:', error);
            return 'error';
        } finally {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    return { isInstallable, isInstalled, installApp };
};

export default usePWAInstall;