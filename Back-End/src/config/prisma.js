import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
    return client;
};

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

// Prisma lo hará automáticamente en la primera consulta.
if (process.env.NODE_ENV === 'development') {
    prisma.$connect()
        .catch(err => console.error('❌ Error de conexión Prisma:', err.message));
}
