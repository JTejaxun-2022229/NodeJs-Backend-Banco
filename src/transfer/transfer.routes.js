import { Router } from "express";
import { check } from "express-validator";
import { createTransfer, getTransfers, getTransfersByEmisor, getTransfersByReceptor, revertTransfer, getTransfersByEmisorId } from "./transfer.controller.js";

const router = Router()

router.post(
    '/',
    createTransfer
)

router.get(
    '/',
    getTransfers
)

router.get('/:emisorId', getTransfersByEmisorId)

router.get(
    '/send/:userId',
    getTransfersByEmisor
);

router.get(
    '/received/:userId',
    getTransfersByReceptor
);

router.put(
    '/:transferId',
    revertTransfer
);

export default router 