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
    existingEmail,
    existeAdminById,
} from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get(
    "/",
    validarJWT,
    getAdmin
);

router.get(
    "/:id",
    [
        validarJWT,
        check("id", "This is not a valid id").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos,
    ],
    getAdminById
);

router.get(
    "/email/:correo",
    [
        //check("email", "Enter a email").not().isEmpty(),
        //check("email").custom(existingEmail),
        validarCampos,
    ],
    getAdminEmail
);

router.post(
    "/",
    [
        validarJWT,
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe ser mayor a 6 caracteres").isLength({
            min: 6,
        }),
        check("correo", "Este no es un correo válido").isEmail(),
        check("correo").custom(existingEmail),
        validarCampos, 
    ],
    postAdmin
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos,
    ],
    putAdmin
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeAdminById),
        validarCampos,
    ],
    deleteAdmin
);

export default router;