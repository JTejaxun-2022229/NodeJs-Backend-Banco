import { Router } from "express";
import { check } from "express-validator";
import { CreditPost, getCreditAll, getCreditAllfalse } from "./credit.controller.js";


const router = Router();

router.post(
    "/addCredit",
    [
        //Necesario colocar validation-jwt
        check("balance", "El balance is mandadory").not().isEmpty(),
        check("description", "La description is mandaroty").not().isEmpty(),
    ], CreditPost
);

router.get('/', getCreditAll)
router.get('/false', getCreditAllfalse)

export default router;