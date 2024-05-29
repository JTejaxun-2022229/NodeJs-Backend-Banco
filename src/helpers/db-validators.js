import User from '../user/user.model.js';

export const existeEmail = async (email = '') => {
    console.log('existeEmail', email);
    try {
        const user = await User.findOne({ email, state: true });
        if (user) {
            throw new Error(`The user with email ${email} already exists`);
        }
    } catch (error) {
        throw new Error(`Error verifying email existence: ${error.message}`);
    }
};

export const existeDPI = async (DPI = '') => {
    console.log('existeDPI', DPI);
    try {
        const user = await User.findOne({ DPI, state: true });
        if (user) {
            throw new Error(`The user with DPI ${DPI} already exists`);
        }
    } catch (error) {
        throw new Error(`Error verifying DPI existence: ${error.message}`);
    }
};
