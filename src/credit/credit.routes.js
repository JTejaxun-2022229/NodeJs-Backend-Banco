import { Router } from "express";
import { check } from "express-validator";
import { CreditPost, getCreditAll, getCreditAllfalse, ApproveCredit } from "./credit.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/addCredit",
    [
        //Necesario colocar validation-jwt
        validarJWT,
        check("balance", "El balance is mandadory").not().isEmpty(),
        check("description", "La description is mandaroty").not().isEmpty(),
    ], CreditPost
);

router.get('/', getCreditAll);
router.get('/history', getCreditAllfalse);

router.put('/AprovedCredit/:idUser',
[
    check("balance", "The balance is mandatory").not().isEmpty().isNumeric()
], ApproveCredit)

export default router;