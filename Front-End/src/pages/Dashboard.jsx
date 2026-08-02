import "./Dashboard.css";
import { Container } from "react-bootstrap";
import HeaderDash from '../components/layouts/Desafios/headerDash/HeaderDash';
import { LuBookText } from "react-icons/lu";
import ButtonFloat from "../components/ui/ButtonFloat/ButtonFloat";
import CursoSection from "../components/cursos/Section";
import { useMediaQuery } from "../hooks/useMediaQuery";
import FooterDash from "../components/layouts/FooterDash/FooterDash";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HeaderSection from "../components/layouts/HeaderDashboardCollapse/HeaderDashboardCollapse";
import SidebarEscenarios from "../components/layouts/SidebarDesafios/SidebarDesafios";

const DashboardPage = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const location = useLocation();
    const [showHeader, setShowHeader] = useState(Boolean(location.state?.openRewards));
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [rewardPulse, setRewardPulse] = useState(location.state?.rewardPulse || null);

    useEffect(() => {
        if (!location.state?.openRewards) return;
        setShowHeader(true);
        setRewardPulse(location.state.rewardPulse || null);
        // Limpiar state para no reabrir al refrescar
        window.history.replaceState({}, document.title);
    }, [location.state]);

    return (
        <main style={{
            backgroundColor: "#A3DFFD",
            minHeight: "100vh",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden"
        }}>
            <HeaderDash showHeader={showHeader} setShowHeader={setShowHeader} />
            
            {/* 👈 Sidebar con animación similar al Header */}
            <div style={{
                display: "grid",
                gridTemplateRows: isSidebarOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "fixed",
                top: 0,
                left: 0,
                height: "100vh",
                width: isSidebarOpen ? "320px" : "0px",
                zIndex: 1000,
                overflow: "hidden",
                backgroundColor: "#FFFFFF",
                boxShadow: isSidebarOpen ? "2px 0 10px rgba(0,0,0,0.1)" : "none",
            }}>
                <div style={{
                    overflow: "hidden",
                    opacity: isSidebarOpen ? 1 : 0,
                    transform: isSidebarOpen ? "translateX(0)" : "translateX(-20px)",
                    transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    height: "100vh",
                    width: "320px",
                    padding: "1.5rem",
                    paddingTop: "2rem",
                }}>
                    <SidebarEscenarios 
                        isOpen={isSidebarOpen} 
                        onClose={() => setIsSidebarOpen(false)} 
                    />
                </div>
            </div>

            <Container
                fluid
                className="d-flex align-items-start justify-content-between gap-0 flex-column text-white"
                style={{
                    height: "calc(100vh - 90px)",
                    width: '100%',
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    paddingBottom: "1rem",
                    position: 'relative',
                    marginTop: "auto",
                    overflowY: "auto",
                }}
            >
                {/* Header Section con animación de despliegue */}
                <div style={{
                    display: "grid",
                    gridTemplateRows: showHeader ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    marginBottom: showHeader ? "1rem" : "0",
                    width: "100%"
                }}>
                    <div style={{
                        overflow: "hidden",
                        opacity: showHeader ? 1 : 0,
                        transform: showHeader ? "translateY(0)" : "translateY(-20px)",
                        transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}>
                        <HeaderSection isOpen={showHeader} animateRewards={Boolean(rewardPulse)} />
                    </div>
                </div>

                {/* Curso Section */}
                <CursoSection />

                {!isMobile && <FooterDash />}

                {/* Botón Flotante Principal con Libro y Dropdown */}
                <ButtonFloat
                    onClick={() => setIsSidebarOpen(true)}
                    className="btn btn-primary"
                    style={{
                        height: '60px',
                        backgroundColor: '#FFDB54',
                        border: 'none',
                        top: "10rem",
                        left: 0,
                        padding: "0 1.5rem",
                        position: 'absolute',
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0',
                        zIndex: 150,
                        cursor: 'pointer'
                    }}
                >
                    <LuBookText color="black" size={30} />
                </ButtonFloat>
            </Container>
        </main>
    );
};

export default DashboardPage;