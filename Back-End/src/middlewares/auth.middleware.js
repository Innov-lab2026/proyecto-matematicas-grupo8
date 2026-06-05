import supabase from '../config/supabase.js';
import prisma from '../config/prisma.js';

export const checkAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No se proporcionó un token de acceso' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }

        const dbUser = await prisma.usuario.findUnique({
            where: { id: user.id },
            select: { rol: true }
        });

        req.user = { ...user, rol: dbUser?.rol || 'usuario' };
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Error al validar la identidad del usuario' });
    }
};
