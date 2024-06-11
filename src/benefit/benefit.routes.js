import { Router } from "express";
import { check } from "express-validator";
import { createBenefit, getBenefits, getBenefitsActives, getBenefitById, updateBenefit, deleteBenefit } from "./benefit.controller.js";
import { existsBenefit, existsNameBenefit, priceAboveZero, benefitStatus } from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    "/create",
    [
        check("nameBenefit", "Name to benefit is necesary").not().isEmpty(),
        check("nameBenefit").custom(existsNameBenefit),
        check("descriptionBenefit", "Description to benefit is necesary").not().isEmpty(),
        check("stock", "Stock to benefit is necesary").not().isEmpty(),
        check("price", "Price to benefit is necesary").not().isEmpty(),
        check("price").custom(priceAboveZero),
        validarCampos
    ],
    createBenefit
)

router.get(
    "/",
    getBenefits
)

router.get(
    "/benefits",
    getBenefitsActives
)

router.get(
    "/:id",
    [
        check("id", "Invalid benefit ID").isMongoId(),
        check("id").custom(existsBenefit)
    ],
    getBenefitById
)

router.put(
    "/update/:id",
    [
        check("id", "Invalid benefit ID").isMongoId(),
        check("id").custom(existsBenefit),
        check("nameBenefit").custom(existsNameBenefit),
        check("price").custom(priceAboveZero)
    ],
    updateBenefit
)

router.delete(
    "/:id",
    [
        check("id", "Invalid benefit ID").isMongoId(),
        check("id").custom(existsBenefit),
        check("id").custom(benefitStatus)
    ],
    deleteBenefit
)

export default router