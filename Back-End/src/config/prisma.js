import 'dotenv/config';
import { PrismaClient } from '../generated/client/index.js';

let prisma;

const isDbConfigured = process.env.DATABASE_URL &&
                      process.env.DATABASE_URL !== 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public';

if (!isDbConfigured) {
    console.error('❌ CRÍTICO: DATABASE_URL no está configurada en las variables de entorno del servidor.');
}

try {
    prisma = new PrismaClient();
    // Intento de conexión "lazy" para validar en el arranque
    prisma.$connect()
        .then(() => {
            console.log('\x1b[32m%s\x1b[0m', '✅ Conexión a Base de Datos establecida');
        })
        .catch(err => {
            console.error('❌ Error de conexión inicial Prisma:', err.message);
        });
} catch (error) {
    console.error('Advertencia al inicializar Prisma Client:', error.message);
}

export default prisma;
