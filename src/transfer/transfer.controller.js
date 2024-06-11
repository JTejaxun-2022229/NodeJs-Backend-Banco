import mongoose from "mongoose";
import Transfer from './transfer.model.js';

export const createTransfer = async (req, res) => {
    const { amount, emisor, receptor, description } = req.body; 
    
    try {
        const emisorUser = await UserActivation.findById(emisor);
        if (emisorUser.balance < amount) {
            return res.status(400).send('Insufficient balance');
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const dailyTransfers = await Transfer.aggregate([
            { $match: { emisor: mongoose.Types.ObjectId(emisor), date: { $gte: todayStart } } },
            { $group: { _id: "$emisor", totalAmount: { $sum: "$amount" } } }
        ]);

        const totalAmountToday = dailyTransfers.length ? dailyTransfers[0].totalAmount : 0;
        if (totalAmountToday + amount > 10000) {
            return res.status(400).send('daily transfer limit exceeded');
        }

        const newTransfer = new Transfer({
            amount,
            emisor,
            receptor,
            balance: emisorUser.balance - amount,
            description,
            date: new Date()
        });

        emisorUser.balance -= amount;
        await emisorUser.save();

        const receptorUser = await User.findById(receptor);
        receptorUser.balance += amount;
        await receptorUser.save();

        await newTransfer.save();
        res.status(201).json(newTransfer);
    } catch (e) {
        console.error('Error creating transfer:', error);
        res.status(400).send('Error creating transfer');
    }
};

export const getTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find();
        res.status(200).json(transfers);
    } catch (error) {
        res.status(500).send('Error fetching transfers');
    }
};

export const getTransferById = async (req, res) => {
    const { id } = req.params;
    try {
        const transfer = await Transfer.findById(id);
        if (!transfer) {
            return res.status(404).send('Transfer not found');
        }
        res.status(200).json(transfer);
    } catch (error) {
        res.status(500).send('Error fetching transfer');
    }
};

export const updateTransfer = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const updatedTransfer = await Transfer.findByIdAndUpdate(id, { amount }, { new: true });

        if (!updatedTransfer) {
            return res.status(404).send('Transfer not found');
        }
        res.status(200).json(updatedTransfer);
    } catch (error) {
        res.status(400).send('Error updating transfer');
    }
};

export const deleteTransfer = async (req, res) => {
    const { id } = req.params;
    try {
        const transfer = await Transfer.findByIdAndUpdate(id, { reversed: true });
    
        res.status(200).json({
            msg: 'The transfer has been removed',
            transfer
        });
        
    } catch (e) {
        console.e('error trying to remove the transfer:', e);
        res.status(500).json({
            error: 'Internal error server'
        });
    }
};