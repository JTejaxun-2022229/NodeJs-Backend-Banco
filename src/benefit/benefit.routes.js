import { Router } from "express";
import { check } from "express-validator";
import { createBenefit, getBenefits, getBenefitById, updateBenefit, deleteBenefit } from "./benefit.controller.js";

const router = Router();

router.post(
    "/create",
    [
        check("nameBenefit").not().isEmpty(),
        check("descriptionBenefit").not().isEmpty(),
        check("stock").not().isEmpty(),
        check("price").not().isEmpty()
    ],
    createBenefit
);

router.get(
    "/",
    getBenefits
);

router.get(
    "/:id",
    getBenefitById
);

router.put(
    "/update/:id",
    [
        check("id", "Invalid hotel ID").isMongoId(),
    ],
    updateBenefit
);

router.delete(
    "/:id",
    [
        check("id", "Invalid hotel ID").isMongoId(),
    ],
    deleteBenefit
);

export default router;
