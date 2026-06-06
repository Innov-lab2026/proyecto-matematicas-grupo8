if (process.env.NODE_ENV !== 'production') {
    await import('dotenv/config');
}
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
        datasources: {
            db: { url: process.env.DATABASE_URL },
        },
    });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// En serverless, es mejor no forzar el $connect() al inicio si no es necesario.
// Prisma lo hará automáticamente en la primera consulta.
if (process.env.NODE_ENV === 'development') {
    prisma.$connect()
        .catch(err => console.error('❌ Error de conexión Prisma:', err.message));
}
