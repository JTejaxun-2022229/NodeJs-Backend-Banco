import { Router } from "express";
import { check } from "express-validator";
import { createTransfer, getTransfers, getTransferById, updateTransfer, deleteTransfer } from "./transfer.controller.js";
import { validateJWT } from "../middlewares/validate-jwt.js";

const router = Router()

router.get('/', getTransfers)

router.get('/:id',
    [
        check('id', 'The transfer ID is necessary').not().isEmpty()
    ], getTransferById)

router.post('/trasnfer',
    [
        validateJWT
    ],createTransfer)

router.put('/:id',
    [
        check('id', 'The transfer ID is necessary').not().isEmpty()
    ], updateTransfer)

router.delete('/:id',
    [
        validateJWT,
        check('id', 'The transfer ID is necessary').not().isEmpty()
    ], deleteTransfer)

export default router 