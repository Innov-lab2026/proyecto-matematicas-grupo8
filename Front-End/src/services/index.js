import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001/api', // Agregamos /api para que sea la base
    headers: {
        'Content-Type': 'application/json' // Tipo de contenido para las solicitudes
    }
});
