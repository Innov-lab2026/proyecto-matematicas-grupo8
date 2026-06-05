import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const { user } = await login(email, password); // Login con Supabase Auth

            // Sincronizar perfil con el Back-End (crear o actualizar en PostgreSQL)
            await axios.post('/api/usuarios/registro', {
                uid: user.id,
                email: user.email,
                // Supabase a veces no tiene 'full_name' por defecto, lo derivamos del email
                nombre: user.user_metadata?.full_name || user.email.split('@')[0]
            });

            navigate(from, { replace: true });
        } catch (err) {
            console.error('Error durante el login o sincronización:', err);
            // Supabase Auth devuelve errores en err.message
            setError(err.message || 'Error al iniciar sesión. Verificá tus credenciales.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3>Iniciar Sesión</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="emailInput" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="emailInput" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordInput" className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" id="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button type="submit" className="btn btn-primary">Entrar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
