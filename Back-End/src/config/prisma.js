import 'dotenv/config';
import { PrismaClient } from '../generated/client/index.js';

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

prisma.$connect()
    .catch(err => {
        console.error('❌ Error de conexión inicial Prisma:', err.message);
    });
