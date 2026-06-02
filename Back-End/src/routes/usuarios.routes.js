import { Router } from 'express';
import { actualizarPerfil, registrarUsuario, loginUsuario, eliminarUsuario, getUsuarios } from '../controllers/usuarios.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getUsuarios);
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.put('/perfil', checkAuth, actualizarPerfil);
router.delete('/eliminar', checkAuth, eliminarUsuario);

export default router;
