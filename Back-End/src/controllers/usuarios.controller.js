import prisma from '../config/prisma.js';
import ApiError from '../exceptions/ApiError.js';
import { registroSchema, perfilSchema } from '../validators/usuarios.validator.js';

export const registrarUsuario = async (req, res, next) => {
    try {
        const uid = req.user.id;
        const validacion = registroSchema.safeParse(req.body);

        if (!validacion.success) {
            throw ApiError.badRequest(validacion.error.errors[0].message);
        }

        const { email, nombre } = validacion.data;
        const adminEmails = process.env.ADMIN_EMAILS
            ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
            : [];

        const rolAsignado = adminEmails.includes(email) ? 'admin' : 'usuario';

        const usuario = await prisma.usuario.upsert({
            where: { id: uid },
            update: { nombre, rol: rolAsignado },
            create: {
                id: uid,
                email,
                nombre,
                rol: rolAsignado
            }
        });
        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const actualizarPerfil = async (req, res, next) => {
    try {
        const uid = req.user.id;
        const validacion = perfilSchema.safeParse(req.body);

        if (!validacion.success) {
            throw ApiError.badRequest(validacion.error.errors[0].message);
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
