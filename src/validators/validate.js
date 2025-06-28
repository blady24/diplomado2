function validateUser(schema,target = 'body') {
    //console.log(`Validating ${target} with schema`, schema);
    return (req, res, next) => {
        const data = req[target];
        //paso 1 verificar que haya datos
        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'No data provided' });
        }
        //paso 2 validar contra el esquema con opciones
        const { error,value} = schema.validate(data, 
            { 
                abortEarly: false, // no detenerse en el primer error
                stripUnknown: true,  // eliminar propiedades no definidas en el esquema
            });
        //paso 3 si hay error, retornar error
        if (error) {
            const errorMessages = error.details.map(err => err.message);
            return res.status(400).json({ error: 'Validation failed', details: errorMessages });
        }

        //paso 4 reemplazar los datos originales con los validados
        req[target] = value;
        next();
    }
}
export default validateUser;