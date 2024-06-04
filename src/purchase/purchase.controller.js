import { request, response } from "express"
import Purchase from "./purchase.model.js"
import User from "../user/user.model.js"
import Benefit from "../benefit/benefit.model.js"

export const createPurchase = async (req = request, res = response) => {

    try {

        const { nameBenefit, quantity, userName } = req.body;

        const benefit = await Benefit.findOne({ nameBenefit })

        if (!benefit) {

            return res.status(404).json({ msg: "Benefit not found" })
        }

        const totalamount = benefit.price * quantity;

        if (benefit.stock < quantity) {

            return res.status(400).json({ msg: "Insufficient stock" });
        }

        const user = await User.findOne({ username: userName });

        if (!user) {

            return res.status(404).json({ msg: "User not found" })
        }

        const purchase = new Purchase({

            user: user._id,
            benefits: [{
                benefit: benefit._id.
                    quantity
            }],
            totalAmount: totalamount
        })

        await purchase.save();

        benefit.stock -= quantity;

        await benefit.save();

        res.status(201).json(purchase)
    } catch (error) {

        res.status(500).json({ msg: error.msg })
    }
}

export const getPurchase = async (req, res) => {

    try {

        const purchases = await Purchase.find().populate({

            path: 'user',
            select: 'username'
        }).populate({

            path: 'benefits.benefit',
            select: ['nameBenefit', 'price']
        });

        const total = purchases.length;

        res.status(200).json({

            total: total,
            data: purchases
        })
    } catch (error) {

        res.status(500).json({ msg: 'Server Error' });
    }
}

export const getPurchaseByUser = async (req, res) => {

    try {

        const { id } = req.params

        const purchases = await Purchase.find({ user: id }).populate({

            path: 'user',
            select: 'username'
        }).populate({

            path: 'benefits.benefit',
            select: ['nameBenefit', 'price']
        });

        const total = purchases.length;

        res.status(200).json({

            total: total,
            data: purchases
        })
    } catch (err) {

        res.status(500).json({ msg: 'Server Error' });
    }
}

export const refundPurchase = async (req, res) => {

    try {

        const { id } = req.params;

        const benefit = await Benefit.findByIdAndUpdate(id, { refunded: true });

        res.status(200).json({
            msg: 'The Purchase has been refunded',
            benefit
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal error server' });
    }
}

