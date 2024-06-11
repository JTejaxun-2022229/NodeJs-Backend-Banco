import User from '../user/user.model.js';
import Admin from "../admin/admin.model.js";
import Favorite from '../favorite/favorite.model.js'
import Credit from '../credit/credit.model.js'
import Benefit from '../benefit/benefit.model.js'

// user validations


export const existUsername = async (username = '') => {
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
        throw new Error(`A user with this username: ${username} is already in the database`);
    }
};

export const existNoAccount = async (account = '') => {
    const accountExist = await User.findOne({ account });
    if (accountExist) {
        throw new Error(`A user with this account: ${account} is already in the database`);
    }
}

export const existeDPI = async (DPI = '') => {

    const DPIExist = await User.findOne({ DPI });
    if (DPIExist) {
        throw new Error(`A user with this DPI: ${DPI} is already in the database`);
    }
};

export const existeEmail = async (email = '') => {
    const existEmailUser = await User.findOne({ email });
    if (existEmailUser) {
        throw new Error(`A user with this email: ${email} is already in the database`);
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
