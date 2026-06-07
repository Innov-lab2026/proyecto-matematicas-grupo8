import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Alert
} from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { user } = await login(email, password); // Login con Supabase Auth

            await api.post('/usuarios/registro', {
                uid: user.id,
                email: user.email,
                nombre: user.user_metadata?.full_name || user.email.split('@')[0]
            });

            navigate(from, { replace: true });
        } catch (err) {
            console.error('Error durante el login o sincronización:', err);
            setError(err.message || 'Error al iniciar sesión. Verificá tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-primary text-white text-center">
                            <h3 className="mb-0">Iniciar Sesión</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="emailInput">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-4" controlId="passwordInput">
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="tu contraseña secreta"
                                            required
                                        />
                                    </Form.Group>
                                    {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}
                                    <div className="d-grid mt-4">
                                        <Button variant="primary" type="submit" size="lg" disabled={loading}>
                                            {loading ? 'Entrando...' : 'Entrar'}
                                        </Button>
                                    </div>
                                </Form>
                                <div className="text-center mt-4">
                                    <p className="text-muted small mb-0">
                                        ¿No tenés cuenta?{' '}
                                        <Link to="/register" className="text-primary text-decoration-none fw-bold">
                                            Registrate acá
                                        </Link>
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
