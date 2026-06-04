import { useState, useEffect } from 'react';
import { Container, Form, Button, Card, InputGroup, Modal, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { axiosInstance } from '../services/index';

const TestValidation = () => {
    const { login, register, logout, deleteAccount, user, setError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showUsersModal, setShowUsersModal] = useState(false);
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        if (user && user.nombre) {
            setNombre(user.nombre);
            setEmail(user.email);
        }
    }, [user]);

    const handleAction = async (type) => {
        if (type === 'login') {
            await login(email, password);
        } else {
            await register(email, password, nombre);
        }
    };

    const handleDelete = async () => {
        const result = await deleteAccount(confirmPassword);
        if (result.success) {
            setShowDeleteModal(false);
            setConfirmPassword('');
        }
    };

    const handleShowUsers = async () => {
        try {
            const response = await axiosInstance.get('/usuarios');
            setUsersList(response.data);
            setShowUsersModal(true);
        } catch (err) {
            setError("No se pudo recuperar la lista de usuarios del núcleo.");
        }
    };

    const selectUser = (u) => {
        setEmail(u.email);
        setPassword(u.password || '');
        setNombre(u.nombre || '');
        setShowUsersModal(false);
    };

    return (
        <div data-bs-theme="dark" className="bg-dark text-light min-vh-100 w-100 pt-5 pb-5">
            <Container>
                <Card className="p-4 shadow-sm border-secondary mb-4">
                    <Card.Title className="mb-4 text-info d-flex justify-content-between align-items-center">
                        validación de API
                        <div className="d-flex gap-2">
                            <Button variant="outline-info" size="sm" onClick={handleShowUsers}>
                                ver registro
                            </Button>
                            {user && (
                                <Button variant="outline-danger" size="sm" onClick={logout}>
                                    cerrar sesión
                                </Button>
                            )}
                        </div>
                    </Card.Title>
                    <Form autoComplete="off">
                        <Form.Group className="mb-3">
                            <Form.Label>email (login con "usuarios" y "password" ya registrados [usuarios.csv])</Form.Label>
                            <Form.Control
                                type="email"
                                name="test-email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@test.com"
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>contraseña ([User123!] para usuarios, [Admin123!] para admins)</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="test-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Ocultar" : "Ver"}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>nombre (usar para "registrar" o "actualizar datos existentes")</Form.Label>
                            <Form.Control
                                type="text"
                                name="test-nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre del usuario"
                                autoComplete="off"
                            />
                        </Form.Group>
                        <div className="d-flex gap-2">
                            <Button variant="outline-info" onClick={() => handleAction('login')}>inicio de sesión</Button>
                            <Button variant="info" onClick={() => handleAction('register')}>registro de usuario</Button>
                        </div>
                    </Form>
                </Card>

                {user && (
                    <Card className="p-4 shadow-sm border-danger">
                        <Card.Title className="text-danger mb-3">acción irreversible</Card.Title>
                        <p className="text-muted small">al borrar tu cuenta se perderán tu progreso y puntos en el servidor.</p>
                        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                            borrar cuenta
                        </Button>
                    </Card>
                )}

                <div className="mt-4 text-muted small text-center">
                    pruebas de consistencia de datos en el núcleo del servidor.
                </div>

                {/* modal de borrado */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered data-bs-theme="dark">
                    <Modal.Header closeButton className="border-secondary">
                        <Modal.Title className="text-danger">confirmar eliminación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-light">
                        <p>para confirmar que querés borrar tu cuenta, ingresá tu contraseña actual:</p>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="contraseña"
                        />
                    </Modal.Body>
                    <Modal.Footer className="border-secondary bg-dark">
                        <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>cancelar</Button>
                        <Button variant="danger" onClick={handleDelete}>borrar definitivamente</Button>
                    </Modal.Footer>
                </Modal>

                {/* modal lista usuarios CSV */}
                <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} size="lg" centered data-bs-theme="dark">
                    <Modal.Header closeButton className="border-secondary">
                        <Modal.Title className="text-info">lista de usuarios en Mock (usuarios.csv)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="bg-dark text-light p-0">
                        <Table striped bordered hover variant="dark" responsive className="mb-0">
                            <thead>
                                <tr>
                                    <th>nombre</th>
                                    <th>email</th>
                                    <th>rol</th>
                                    <th>acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usersList.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.nombre}</td>
                                        <td>{u.email}</td>
                                        <td><small className="text-info">{u.rol}</small></td>
                                        <td>
                                            <Button variant="outline-info" size="sm" onClick={() => selectUser(u)}>
                                                cargar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer className="border-secondary bg-dark">
                        <Button variant="secondary" onClick={() => setShowUsersModal(false)}>Cerrar</Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
};

export default TestValidation;
