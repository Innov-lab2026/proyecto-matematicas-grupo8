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
    console.log('\x1b[32m%s\x1b[0m', '--- Infraestructura de Base de Datos Vinculada ---');
} catch (error) {
    console.error('Advertencia al inicializar Prisma Client:', error.message);
}

export default prisma;
