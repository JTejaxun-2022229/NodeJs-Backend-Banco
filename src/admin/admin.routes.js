import { Router } from "express";
import { check } from "express-validator";
import {
    getAdmin,
    postAdmin,
    getAdminById,
    putAdmin,
    deleteAdmin,
    getAdminEmail,
} from "./admin.controller.js";
import {
    existingAdminEmail,
    existeAdminById,
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

// Post ADMIN
router.post(
    "/",
    [
        //validarJWT,
        check("email", "The email is required").not().isEmpty(),
        check("password", "The password is required").not().isEmpty(),
        check("password", "The password needs min 6 characters").isLength({min: 6,}),
        check("email", "This is not a email, please send a valid email").isEmail(),
        check("email").custom(existingAdminEmail),
        validarCampos, 
    ],
    postAdmin
);

/* Get General */ 
router.get(
    "/",
    //validarJWT,
    getAdmin
);

/* Get Por ID */
router.get(
    "/:id",
    [
        //validarJWT,
        check("id", "This is not a valid id").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos,
    ],
    getAdminById
);

/* Get Por Correo */
router.get(
    "/email/:correo",
    [
        //validarJWT,
        validarCampos,
    ],
    getAdminEmail
);

router.put(
    "/:id",
    [
        //validarJWT,
        check("id", "This is not a valid ID").isMongoId(),
        check("id").custom(existeAdminById),
        check("password", "The password needs min 6 characters").isLength({min: 6,}),
        check("email", "This is not a email, please send a valid email").isEmail(),
        validarCampos,
    ],
    putAdmin
);

router.delete(
    "/:id",
    [
        //validarJWT,
        check("id", "This is not a valid ID").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos,
    ],
    deleteAdmin
);

export default router;