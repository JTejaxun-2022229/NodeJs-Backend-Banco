import Admin from "../admin/admin.model.js";

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