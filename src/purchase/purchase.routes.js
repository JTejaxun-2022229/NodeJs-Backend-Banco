import { Router } from "express";
import { check } from "express-validator";
import { createPurchase, getPurchase, getPurchaseByUser, refundPurchase } from "./purchase.controller.js"

const router = Router();

router.post(

    '/buy',
    createPurchase
)

router.get(

    '/',
    getPurchase
)

router.get(

    '/:id',
    getPurchaseByUser
)

router.patch(

    '/:id',
    refundPurchase
)