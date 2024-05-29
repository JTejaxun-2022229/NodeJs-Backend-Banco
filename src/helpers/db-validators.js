import User from '../user/user.model.js';

export const existeEmail = async (email = '') => {
    console.log('existeEmail',email)
    try {
        const user = await User.findOne({ email, state: true });
        if (user) {
            throw new Error(`El usuario con el correo electrónico ${email} ya existe`);
            
        }
    } catch (error) {
        throw new Error(`Error al verificar la existencia del correo electrónico: ${error.message}`);
    }
};
