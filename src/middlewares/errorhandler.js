import logger from "../logs/logger.js";

export default function errorHandler(err, req, res, next) {
    console.error('Nombre del Error:', err.message);
    logger

    if (err.name === 'ValidationError') {
        // Manejo de errores de validación
        return res.status(400).json({
            status: 'error',
            message: err.message,
            details: err.details || []
        });
    }else if (err.name === 'UnauthorizedError') {
        // Manejo de errores de autorización
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized access'
        });
    } else if (err.name === 'NotFoundError') {
        // Manejo de errores de recurso no encontrado
        return res.status(404).json({
            status: 'error',
            message: 'Resource not found'
        });
    } else if (
        err.name === 'SequelizeValidationError' || 
        err.name === 'SequelizeUniqueConstraintError' || 
        err.name === 'SequelizeForeignKeyConstraintError'
    ) {
        return res.status(400).json({
            status: 'error',
            message: err.message,
            details: err.details || []
        });
    } else {
        // Manejo de otros errores
        console.error('Error interno del servidor:', err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}