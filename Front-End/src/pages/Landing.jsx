import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaDownload } from "react-icons/fa";
import usePWAInstall from '../hooks/usePWAInstall'; // Ajusta la ruta según tu estructura

const FirstSection = React.lazy(() => import('../components/landing/FirstSection/FirstSection'));
const SecondSection = React.lazy(() => import('../components/landing/SecondSection/SecondSection'));
const Introduction = React.lazy(() => import('../components/landing/Introduccion/Introduccion'));
const Footer = React.lazy(() => import('../components/layouts/Footer/Footer'));
const Header = React.lazy(() => import('../components/layouts/header/Header'));
const Banner = React.lazy(() => import('../components/landing/Components/Banner/Banner'));

const Landing = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const { isInstallable, isInstalled, installApp } = usePWAInstall();

    useEffect(() => {
        const handleScroll = () => {
            const containerScroll = containerRef.current?.scrollTop ?? 0;
            const windowScroll = window.scrollY || document.documentElement.scrollTop || 0;
            setShowScrollTop(Math.max(containerScroll, windowScroll) > 250);
        };

        const container = containerRef.current;
        window.addEventListener('scroll', handleScroll, { passive: true });
        container?.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            container?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const hash = window.location.hash?.replace('#', '');
        if (!hash) return;
        const timer = setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
        return () => clearTimeout(timer);
    }, []);

    const scrollToTop = () => {
        const container = containerRef.current;
        if (container?.scrollTop > 0) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
        <Container ref={containerRef} fluid className="p-0 m-0 overflow-auto overflow-x-hidden" style={{ backgroundColor: "#F0F1EB" }}>
            <a href="#contenido-principal" className="skip-link">
                Saltar al contenido
            </a>
            <Header />
            <main id="contenido-principal">
                <FirstSection navigate={navigate} />
                <Banner />
                <Introduction />
                <SecondSection />
            </main>
            <Footer />
        </Container>

        {/* Botón de Instalación PWA */}
        {isInstallable && !isInstalled && (
            <button
                type="button"
                onClick={installApp}
                aria-label="Instalar aplicación"
                style={{
                    position: 'fixed',
                    right: '40px',
                    bottom: '110px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    fontSize: '30px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.22)',
                    zIndex: 1200,
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: 'pulse 2s infinite',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <FaDownload />
            </button>
        )}

        {/* Botón de Scroll al inicio (existente) */}
        {showScrollTop && (
            <button
                type="button"
                onClick={scrollToTop}
                aria-label="Volver al inicio"
                style={{
                    position: 'fixed',
                    right: '40px',
                    bottom: '40px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#FFDB54',
                    color: 'black',
                    fontSize: '30px',
                    cursor: 'pointer',
                    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.22)',
                    zIndex: 1200,
                    transition: 'transform 0.2s ease, opacity 0.2s ease',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                }}
            >
                <FaArrowUp color="white" />
            </button>
        )}

        {/* Añadir la animación CSS para el botón de instalación */}
        <style>{`
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `}</style>
        </>
    );
}

export default Landing;