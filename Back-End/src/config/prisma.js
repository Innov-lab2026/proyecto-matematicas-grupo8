import 'dotenv/config';
import { PrismaClient } from '../generated/client/index.js';

let prisma;

const isDbConfigured = process.env.DATABASE_URL &&
                      process.env.DATABASE_URL !== 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public';

if (!isDbConfigured) {
    throw new Error('DATABASE_URL no está configurada o tiene el valor por defecto. El despliegue no puede continuar.');
}

try {
    prisma = new PrismaClient();
    console.log('\x1b[32m%s\x1b[0m', '--- Infraestructura de Base de Datos Vinculada ---');
} catch (error) {
    console.error('Advertencia al inicializar Prisma Client:', error.message);
}

export default prisma;
