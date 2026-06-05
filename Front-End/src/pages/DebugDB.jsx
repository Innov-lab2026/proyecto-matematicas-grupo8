import React, { useState } from 'react';
import api from '../config/api';
import { useAuth } from '../context/AuthContext';

const DebugDB = () => {
    const { user } = useAuth();
    const [status, setStatus] = useState('Esperando acción...');
    const [dbData, setDbData] = useState(null);
    const [geminiStatus, setGeminiStatus] = useState(null);

    const testSync = async () => {
        try {
            setStatus('Sincronizando...');
            const res = await api.post('/usuarios/registro', {
                // Si no hay usuario logueado, mandamos un ID de test para no crashear
                uid: user?.id || 'test-uid-manual-123',
                email: user?.email || 'test-debug@innovalab.com',
                nombre: 'Tester de DB'
            });
            setDbData(res.data);
            setStatus('Sincronización Exitosa (Postgres OK)');
        } catch (err) {
            console.error(err);
            setStatus('Error: ' + (err.response?.data?.error || err.message));
        }
    };

    const testGemini = async () => {
        try {
            setGeminiStatus('Consultando salud del Back-End...');
            const res = await api.get('/health');
            setGeminiStatus(`Back-End Online: ${res.data.timestamp}`);
        } catch (err) {
            setGeminiStatus('Error de conexión: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#1a1a1a', color: '#00ff00', minHeight: '100vh' }}>
            <h2>☢ InnovaLab - Debug Zone ☢</h2>
            <div style={{ border: '1px solid #444', padding: '10px', marginBottom: '10px' }}>
                <p><strong>VITE_API_URL:</strong> {import.meta.env.VITE_API_URL || 'No definida (Usando fallback)'}</p>
                <p><strong>Modo:</strong> {import.meta.env.MODE}</p>
            </div>
            <p>Usuario: {user?.email || 'No logueado'}</p>
            <p>ID: {user?.id}</p>
            <hr />
            <button onClick={testSync} style={{ padding: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                PROBAR UPSERT EN POSTGRES
            </button>
            <div style={{ marginTop: '20px', border: '1px solid #00ff00', padding: '10px' }}>
                <strong>Estado:</strong> {status}
            </div>

            <button onClick={testGemini} style={{ marginTop: '20px', padding: '10px', background: '#333', color: '#fff' }}>
                VERIFICAR API HEALTH
            </button>
            <p>Estado API: {geminiStatus}</p>

            {dbData && (
                <pre style={{ marginTop: '20px', backgroundColor: '#333', padding: '10px' }}>
                    {JSON.stringify(dbData, null, 2)}
                </pre>
            )}
        </div>
    );
};

export default DebugDB;
