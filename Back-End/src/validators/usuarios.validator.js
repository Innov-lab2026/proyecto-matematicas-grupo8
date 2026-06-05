import { z } from 'zod';

const passwordSchema = z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[!@#$%^&*]/, "Debe contener un carácter especial (ejemplos: ! @ # $ % ^ & *)")

export const registroSchema = z.object({
    uid: z.string().min(1, "El UID es obligatorio"),
    email: z.string()
        .email({ message: "Formato de email inválido" })
        .trim()
        .toLowerCase(),
    nombre: z.string()
        .min(2, { message: "El nombre es muy corto" })
        .max(50)
        .optional()
});

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida")
});

export const perfilSchema = z.object({
    nombre: z.string()
        .min(2, { message: "El nombre es muy corto" })
        .max(50)
});
