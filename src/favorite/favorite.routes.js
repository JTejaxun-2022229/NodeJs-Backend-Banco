import { Router } from "express";
import { check } from "express-validator";
import {
    getFavorites,
    postFavorite,
    getFavoriteById,
    putFavorite,
    deleteFavorite,
    getFavoriteByDPI
} from "./favorite.controller.js";
import {
    existsFavoriteById
} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

/* Post Favorite */
router.post(
    "/",
    [
        check("idUser", "The idUser is required").not().isEmpty(),
        check("idUser", "this is not a ID for idUser").isMongoId(),
        check("noAccount", "The noAccount is required").not().isEmpty(),
        check("DPI", "The DPI is required").not().isEmpty(),
        check("alias", "The alias is required").not().isEmpty(),
        validarCampos,
    ],
    postFavorite
);

/* Get General */
router.get(
    "/",
    getFavorites
);

/* Get By ID */
router.get(
    "/:id",
    [
        check("id", "This is not a valid ID").isMongoId(),
        validarCampos,
    ],
    getFavoriteById
);

router.put(
    "/:id",
    [
        check("id", "This is not a valid ID").isMongoId(),
        check("id").custom(existsFavoriteById),
        validarCampos,
    ],
    putFavorite
);

router.delete(
    "/:id",
    [
        check("id", "This is not a valid ID").isMongoId(),
        check("id").custom(existsFavoriteById),
        validarCampos,
    ],
    deleteFavorite
);

export default router;