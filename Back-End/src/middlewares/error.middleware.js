import ApiError from '../exceptions/api.error.js';
import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Evento inesperado en el núcleo del servidor';
    let errors = [];

    if (err instanceof ZodError) {
        statusCode = 400;
        message = 'Inconsistencia en datos ingresados';
        errors = err.issues.map(issue => `${issue.path.join('.')} ${issue.message}`);
    } else if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = [err.message];
    } else {
        console.error(err);
        errors = [message];
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        errors,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export default errorHandler;
