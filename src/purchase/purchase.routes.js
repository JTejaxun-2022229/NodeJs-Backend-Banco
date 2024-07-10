import { Router } from "express";
import { check } from "express-validator";
import { createPurchase, getPurchases, getPurchasesByAccount, refundPurchase } from "./purchase.controller.js"

const router = Router();

router.post(

    '/buy',
    createPurchase
)

router.get(
    '/purchases',
    getPurchases
);

router.get(
    '/purchases/:account',
    getPurchasesByAccount
);

router.put(
    '/purchases/refund/:purchaseId', 
    refundPurchase
);

export default router;