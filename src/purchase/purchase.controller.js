import { request, response } from "express"
import Purchase from "./purchase.model.js"
import User from "../user/user.model.js"
import Benefit from "../benefit/benefit.model.js"

export const createPurchase = async (req, res) => {

    const { account, benefits } = req.body;

    try {

        const user = await User.findOne({ account });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let totalAmount = 0;


        const benefitUpdates = [];

        const processedBenefits = [];

        for (const { nameBenefit, quantity } of benefits) {

            const benefit = await Benefit.findOne({ nameBenefit });
            if (!benefit) {
                return res.status(404).json({ message: `Benefit ${nameBenefit} not found` });
            }

            if (benefit.stock < quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${nameBenefit}` });
            }

            totalAmount += benefit.price * quantity;

            benefit.stock -= quantity;
            benefitUpdates.push(benefit.save());

            processedBenefits.push({
                benefit: benefit._id,
                quantity
            });
        }

        if (user.balance < totalAmount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.balance -= totalAmount;
        await user.save();

        await Promise.all(benefitUpdates);

        const purchase = new Purchase({
            user: user._id,
            benefits: processedBenefits,
            totalAmount
        });

        await purchase.save();

        res.status(201).json(purchase);
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const getPurchases = async (req, res) => {

    try {

        const purchases = await Purchase.find()
            .populate('user', 'name')
            .populate('benefits.benefit', 'nameBenefit price')
            .exec();

        const formattedPurchases = purchases.map(purchase => ({
            id: purchase._id,
            user: purchase.user.name,
            benefits: purchase.benefits.map(benefit => ({
                nameBenefit: benefit.benefit.nameBenefit,
                price: benefit.benefit.price,
                quantity: benefit.quantity
            })),
            totalAmount: purchase.totalAmount,
            datePurchased: purchase.datePurchase,
            delivered: purchase.delivered,
            refunded: purchase.refunded
        }));

        res.status(200).json({
            totalPurchases: purchases.length,
            purchases: formattedPurchases
        });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const getPurchasesByAccount = async (req, res) => {

    const { account } = req.params;

    try {

        const user = await User.findOne({ account });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const purchases = await Purchase.find({ user: user._id })
            .populate('user', 'name')
            .populate('benefits.benefit', 'nameBenefit price')
            .exec();

        const formattedPurchases = purchases.map(purchase => ({
            id: purchase._id,
            user: purchase.user.name,
            benefits: purchase.benefits.map(benefit => ({
                nameBenefit: benefit.benefit.nameBenefit,
                price: benefit.benefit.price,
                quantity: benefit.quantity
            })),
            totalAmount: purchase.totalAmount,
            datePurchased: purchase.datePurchase,
            delivered: purchase.delivered,
            refunded: purchase.refunded
        }));

        res.status(200).json({
            totalPurchases: purchases.length,
            purchases: formattedPurchases
        });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const refundPurchase = async (req, res) => {

    const { purchaseId } = req.params;

    try {

        const purchase = await Purchase.findById(purchaseId)
            .populate('user')
            .populate('benefits.benefit');

        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        if (purchase.refunded) {
            return res.status(400).json({ message: 'Purchase already refunded' });
        }

        const user = purchase.user;
        user.balance += purchase.totalAmount;
        await user.save();


        const benefitUpdates = purchase.benefits.map(async ({ benefit, quantity }) => {
            benefit.stock += quantity;
            await benefit.save();
        });


        await Promise.all(benefitUpdates);

        purchase.refunded = true;
        await purchase.save();

        res.json({ message: 'Purchase refunded successfully', purchase });
    } catch (error) {

        res.status(500).json({ message: 'Internal server error', error });
    }
};