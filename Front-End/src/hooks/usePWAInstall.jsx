/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';

const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);

    useEffect(() => {
        // Detectar si ya está instalada
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        setIsInstalled(isStandalone);

        if (isStandalone) {
            console.log('✅ App ya está instalada');
            return;
        }

        // 🔥 ESTRATEGIA 1: Forzar la verificación del manifest
        const forceManifestCheck = () => {
            // Esto ayuda a Chrome a "despertar" y verificar la PWA
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    console.log('✅ Service Worker listo, verificando instalabilidad...');
                    // Disparar un evento personalizado para "recordar" a Chrome
                    window.dispatchEvent(new Event('appinstalled'));
                });
            }
        };

        // 🔥 ESTRATEGIA 2: Intentar activar el prompt con un timeout
        const tryActivatePrompt = () => {
            if (!deferredPrompt && !isInstalled) {
                // Simular interacción del usuario
                const fakeClick = new Event('click');
                document.dispatchEvent(fakeClick);
                
                // Forzar una verificación del manifest
                fetch('/manifest.webmanifest')
                    .then(response => response.json())
                    .then(manifest => {
                        console.log('✅ Manifest verificado:', manifest);
                        // Si el manifest es válido, intentar "recordar" a Chrome
                        if (manifest && navigator.serviceWorker.controller) {
                            console.log('🔄 Intentando activar beforeinstallprompt...');
                            // Esto a veces ayuda a Chrome a "darse cuenta"
                            window.location.reload();
                        }
                    })
                    .catch(err => console.error('❌ Error verificando manifest:', err));
            }
        };

        // Escuchar el evento beforeinstallprompt
        const handleBeforeInstallPrompt = (e) => {
            console.log('📱 Evento beforeinstallprompt detectado!');
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
            // Guardar en localStorage que el evento ocurrió
            localStorage.setItem('pwa-prompt-ready', 'true');
        };

        // Escuchar instalación completada
        const handleAppInstalled = () => {
            console.log('✅ App instalada exitosamente');
            setIsInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            localStorage.removeItem('pwa-prompt-ready');
        };

        // Registrar listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // 🔥 ESTRATEGIA 3: Verificar si ya tuvimos el prompt antes
        const hadPromptBefore = localStorage.getItem('pwa-prompt-ready') === 'true';
        if (hadPromptBefore && !deferredPrompt) {
            console.log('🔄 Recuperando estado de instalación anterior...');
            // Si ya tuvimos el prompt antes pero no se instaló, intentar de nuevo
            setIsInstallable(true);
        }

        // Ejecutar estrategias
        setTimeout(forceManifestCheck, 1000);
        setTimeout(tryActivatePrompt, 3000);

        // 🔥 ESTRATEGIA 4: Detectar cuando el usuario hace scroll o click
        const handleUserInteraction = () => {
            if (!deferredPrompt && !isInstalled) {
                console.log('🔄 Usuario interactuó, verificando instalabilidad...');
                // Intentar nuevamente
                tryActivatePrompt();
            }
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('scroll', handleUserInteraction);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('scroll', handleUserInteraction);
        };
    }, []);

    const installApp = useCallback(async () => {
        // Si tenemos el evento beforeinstallprompt, usarlo
        if (deferredPrompt) {
            try {
                console.log('🔄 Mostrando prompt de instalación');
                await deferredPrompt.prompt();
                const result = await deferredPrompt.userChoice;

                if (result.outcome === 'accepted') {
                    console.log('✅ Usuario aceptó la instalación');
                    setIsInstalled(true);
                    setIsInstallable(false);
                    localStorage.removeItem('pwa-prompt-ready');
                    return 'accepted';
                } else {
                    console.log('❌ Usuario rechazó la instalación');
                    return 'dismissed';
                }
            } catch (error) {
                console.error('❌ Error en la instalación:', error);
                return 'error';
            } finally {
                setDeferredPrompt(null);
                setIsInstallable(false);
            }
        }

        // Si no hay beforeinstallprompt, verificar alternativas
        const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
        if (isIOS) {
            return 'manual-ios';
        }

        // 🔥 ESTRATEGIA 5: Intentar forzar en Chrome/Edge
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isEdge = /Edg/.test(navigator.userAgent);
        
        if (isChrome || isEdge) {
            // Intentar recargar la página para activar el beforeinstallprompt
            // Esto funciona si la página ya fue visitada antes
            const visits = parseInt(localStorage.getItem('pwa-visits') || '0') + 1;
            localStorage.setItem('pwa-visits', visits.toString());
            
            if (visits >= 2) {
                // Si ya visitó la página varias veces, intentar recargar
                console.log('🔄 Múltiples visitas detectadas, intentando recargar...');
                // Mostrar un mensaje y recargar después de un breve delay
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
                return 'reloading';
            }
            
            return 'manual-browser';
        }

        return 'unavailable';
    }, [deferredPrompt]);

    return { isInstallable, isInstalled, installApp };
};

export default usePWAInstall;