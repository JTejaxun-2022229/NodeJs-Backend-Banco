import User from '../user/user.model.js';
import Admin from "../admin/admin.model.js";
import Favorite from '../favorite/favorite.model.js'
import Credit from '../credit/credit.model.js'
import Benefit from '../benefit/benefit.model.js'

// user validations

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

//admin validations

/* Validación para que no se repita el correo en el post */
export const existingAdminEmail = async (email = '') => {
    const existEmail = await Admin.findOne({ email });
    if (existEmail) {
        throw new Error(`A admin with this email: ${email} is already in the database`);
    }
};

/* Validación para ver si el ID ingresado es de algun admin */
export const existeAdminById = async (id = '') => {
    const existAdmin = await Admin.findById(id);
    if (!existAdmin) {
        throw new Error(`Admin with ID ${id} does not exist in the database!`);
    }
};

// favorite validation

export const existsFavoriteById = async (id = '') => {
    const existFavorite = await Favorite.findById(id);
    if (!existFavorite) {
        throw new Error(`Favorite with ID ${id} does not exist in the database!`);
    }
};


// benefit validation

export const existsBenefit = async (id = '') => {

    const benefitExists = await Benefit.findOne({ id });

    if (benefitExists) {

        throw new Error(`Benefit with ${id} does not exists.`);
    }
}

export const existsNameBenefit = async (nameBenefit = '') => {

    const nameBenefitExists = await Benefit.findOne({ nameBenefit });

    if (nameBenefitExists) {

        throw new Error(`The benefit called ${nameBenefit} is already registered.`);
    }
}

export const priceAboveZero = async (price = '') => {

    if (price <= 0) {
        
        throw new Error('Price must be greater than zero.');
    }
}

export const benefitStatus = async (id = '') => {

    const benefit = await Benefit.findById(id);

    if (!Benefit.status) {

        throw new Error(`Benefit ${benefit.nameBenefit} is alredy disable`);
    }
}
