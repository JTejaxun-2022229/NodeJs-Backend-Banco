import {Router} from "express";
import {check} from "express-validator";
import {createTransfer, getTransfers, getTransferById, updateTransfer, deleteTransfer} from "./transfer.controller.js";
import {validateJWT} from "../middlewares/validate-jwt.js";

const router = Router()

router.get('/', getTransfers)

router.get('/:transferId',
    [
        check('transferId', 'The transfer ID is necesary').not().isEmpty()
    ], getTransferById)

router.post('/trasnfer',
    [
        validateJWT
    ],createTransfer)

router.put('/:transferId',
    [
        check('transferUpdate', 'The transfer ID is necesary').not().isEmpty()
    ], updateTransfer)

router.delete('/:trasnferId',
    [
        validateJWT,
        check('transferDelete', 'The transfer ID is necesary').not().isEmpty()
    ], deleteTransfer)

export default router 