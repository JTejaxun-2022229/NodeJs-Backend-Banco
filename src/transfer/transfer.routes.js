import { Router } from "express";
import { check } from "express-validator";
import { createTransfer, getTransfers, getTransferById, updateTransfer, deleteTransfer, getTransfersByEmisorId } from "./transfer.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router()

router.get('/', getTransfers)

router.get('/:transferId',
    [
        check('transferId', 'The transfer ID is necesary').not().isEmpty()
    ], getTransferById)

router.post('/trasnfer',
    [
        validarJWT
    ], createTransfer)

router.get('/:emisorId', getTransfersByEmisorId)

router.put('/:transferId',
    [
        check('transferUpdate', 'The transfer ID is necesary').not().isEmpty()
    ], updateTransfer)

router.delete('/:trasnferId',
    [
        validarJWT,
        check('transferDelete', 'The transfer ID is necesary').not().isEmpty()
    ], deleteTransfer)

export default router 