import { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { error, success, setSuccess, setError } = useAuth();
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (error) {
            setShowError(true);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
        }
    }, [success]);

    return (
        <div>
            <main className="min-vh-100">
                {children}
            </main>

            <ToastContainer position="middle-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast
                    show={showError}
                    onClose={() => { setShowError(false); setError(null); }}
                    delay={3000}
                    autohide
                    bg="danger"
                    data-bs-theme="dark"
                >
                    <Toast.Header>
                        <strong className="me-auto">inconsistencia detectada</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {Array.isArray(error) ? (
                            <ul className="mb-0 px-3">
                                {error.map((msg, index) => (
                                    <li key={index}>{msg}</li>
                                ))}
                            </ul>
                        ) : (
                            error
                        )}
                    </Toast.Body>
                </Toast>

                <Toast
                    show={showSuccess}
                    onClose={() => { setShowSuccess(false); setSuccess(null); }}
                    delay={2000}
                    autohide
                    bg="success"
                    data-bs-theme="dark"
                >
                    <Toast.Header>
                        <strong className="me-auto">operación exitosa</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {success}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
};

export default Layout;
