import mongoose from "mongoose";
import Transfer from './transfer.model.js';

export const createTransfer = async (req, res) => {
    const { transfer, emisor, receptor, balance, description, reserved } = req.body;
    try {
        const newTransfer = new Transfer({
            transfer,
            emisor,
            receptor,
            balance,
            date: new Date(),
            description,
            reserved
        });

        await newTransfer.save();
        res.status(201).json(newTransfer);
    } catch (error) {
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
    const { transfer, emisor, receptor, balance, description, reserved } = req.body;
    try {
        const updatedTransfer = await Transfer.findByIdAndUpdate(id, {
            transfer,
            emisor,
            receptor,
            balance,
            description,
            reserved
        }, { new: true });

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
        const deletedTransfer = await Transfer.findByIdAndDelete(id);
        if (!deletedTransfer) {
            return res.status(404).send('Transfer not found');
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error deleting transfer');
    }
};