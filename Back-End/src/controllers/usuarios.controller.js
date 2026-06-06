import prisma from '../config/prisma.js';
import ApiError from '../exceptions/api.error.js';
import { registroSchema, perfilSchema } from '../validators/usuarios.validator.js';

export const registrarUsuario = async (req, res, next) => {
    try {
        const validacion = registroSchema.safeParse(req.body);

        if (!validacion.success) {
            throw validacion.error;
        }

        const { uid, email, nombre } = validacion.data;

        const superAdminEmails = process.env.SUPERADMIN_EMAILS
            ? process.env.SUPERADMIN_EMAILS.replace(/['"]/g, '').split(',').map(e => e.trim().toLowerCase())
            : [];

        const adminEmails = process.env.ADMIN_EMAILS
            ? process.env.ADMIN_EMAILS.replace(/['"]/g, '').split(',').map(e => e.trim().toLowerCase())
            : [];

        let rolFinal = 'usuario';
        const emailNormalizado = email.trim().toLowerCase();
        if (superAdminEmails.includes(emailNormalizado)) {
            rolFinal = 'superadmin';
        } else if (adminEmails.includes(emailNormalizado)) {
            rolFinal = 'admin';
        }

        const usuario = await prisma.usuario.upsert({
            where: { id: uid },
            update: { nombre, rol: rolFinal },
            create: {
                id: uid,
                email,
                nombre,
                rol: rolFinal
            }
        });

        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const eliminarUsuario = async (req, res, next) => {
    try {
        const uid = req.user.id;

        // En producción, aquí también deberías borrar el usuario de Supabase Auth
        // Pero para el MVP, borramos solo el perfil de nuestra DB
        await prisma.usuario.delete({
            where: { id: uid }
        });

        res.status(200).json({ message: "Cuenta borrada correctamente" });
    } catch (error) {
        next(error);
    }
};

export const getUsuarios = async (req, res, next) => {
    try {
        const usuarios = await prisma.usuario.findMany();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

export const actualizarPerfil = async (req, res, next) => {
    try {
        const uid = req.user.id;
        const validacion = perfilSchema.safeParse(req.body);

        if (!validacion.success) {
            throw validacion.error;
        }

        const { nombre } = validacion.data;

        const usuario = await prisma.usuario.update({
            where: {
                id: uid
            },
            data: {
                nombre
            }
        });
        return res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};
