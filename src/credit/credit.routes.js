import { Router } from "express";
import { check } from "express-validator";
import { createCredit, getAcceptedCredits, getCredits, getDeniedCredits, getPendingCredits, getCreditsByAccount,authorizeCredit } from "./credit.controller.js";

const router = Router();

router.post(
    "/requestCredit",
    [
        check("amount", "El balance is mandadory").not().isEmpty(),
        check("description", "La description is mandaroty").not().isEmpty(),
    ],
    createCredit
);

router.post(
    "/authorize",
    [
        check("creditId", "El id is mandadory").not().isEmpty(),
        check("status","El status is mandadory").not().isEmpty(),
    ],authorizeCredit
)

router.get(
    '/credits',
    getCredits
);

router.get(
    '/credits/:account',
    getCreditsByAccount
);

router.get(
    '/pending',
    getPendingCredits
);

router.get(
    '/accepted',
    getAcceptedCredits
);

router.get(
    '/denied',
    getDeniedCredits
);

export default router;