import Transfer from './transfer.model.js';
import User from '../user/user.model.js'

export const createTransfer = async (req, res) => {

    try {

        const { emisor: emisorAccount, amount, receptor: receptorAccount, description } = req.body;

        if (amount <= 0) {
            return res.status(400).json({ message: 'The amount must be greater than 0' });
        }

        const emisorUser = await User.findOne({ account: emisorAccount });
        if (!emisorUser) {
            return res.status(404).json({ message: 'Emisor account not found' });
        }

        if (emisorUser.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const receptorUser = await User.findOne({ account: receptorAccount });
        if (!receptorUser) {
            return res.status(404).json({ message: 'Receptor account not found' });
        }

        const transfer = new Transfer({
            emisor: emisorUser._id,
            amount,
            receptor: receptorUser._id,
            description
        });

        emisorUser.balance -= amount;
        receptorUser.balance += amount;

        await transfer.save();
        await emisorUser.save();
        await receptorUser.save();

        res.status(201).json(transfer);
    } catch (error) {

        res.status(500).json({ message: 'Error creating transfer', error });
    }
};

export const getTransfers = async (req, res) => {

    try {

        const transfers = await Transfer.find({}, { _id: 1, emisor: 1, receptor: 1, amount: 1, description: 1, date: 1, reverted: 1 });
        const count = await Transfer.countDocuments();

        const formattedTransfers = transfers.map(transfer => ({
            id: transfer._id,
            emisor: transfer.emisor,
            receptor: transfer.receptor,
            amount: transfer.amount,
            description: transfer.description,
            date: transfer.date,
            reverted: transfer.reverted
        }));

        res.status(200).json({ count, transfers: formattedTransfers });
    } catch (error) {

        res.status(500).json({ message: 'Error fetching transfers', error });
    }
};

export const getTransfersByEmisorId = async (req, res) => {
    const { emisorId } = req.params;
    try {
        const transfers = await Transfer.find({ emisor: emisorId });
        res.status(200).json(transfers);
    } catch (error) {
        res.status(500).send('Error fetching transfers');
    }
};


export const getTransfersByEmisor = async (req, res) => {

    const { userId } = req.params;

    try {

        const transfers = await Transfer.find({ emisor: userId }, { _id: 1, emisor: 1, receptor: 1, amount: 1, description: 1, date: 1, reverted: 1 });
        const count = await Transfer.countDocuments({ emisor: userId });

        const formattedTransfers = transfers.map(transfer => ({
            id: transfer._id,
            emisor: transfer.emisor,
            receptor: transfer.receptor,
            amount: transfer.amount,
            description: transfer.description,
            date: transfer.date,
            reverted: transfer.reverted
        }));

        res.status(200).json({ count, transfers: formattedTransfers });
    } catch (error) {

        res.status(500).json({ message: 'Error fetching transfers by emisor', error });
    }
};


export const getTransfersByReceptor = async (req, res) => {
    
    const { userId } = req.params;

    try {

        const transfers = await Transfer.find({ receptor: userId }, { _id: 1, emisor: 1, receptor: 1, amount: 1, description: 1, date: 1, reverted: 1 });
        const count = await Transfer.countDocuments({ receptor: userId });

        const formattedTransfers = transfers.map(transfer => ({
            id: transfer._id,
            emisor: transfer.emisor,
            receptor: transfer.receptor,
            amount: transfer.amount,
            description: transfer.description,
            date: transfer.date,
            reverted: transfer.reverted
        }));

        res.status(200).json({ count, transfers: formattedTransfers });
    } catch (error) {
        
        res.status(500).json({ message: 'Error fetching transfers by receptor', error });
    }
};

export const revertTransfer = async (req, res) => {

    const { transferId } = req.params;

    try {

        const transfer = await Transfer.findById(transferId);
        if (!transfer) {
            return res.status(404).json({ message: 'Transfer not found' });
        }

        const now = new Date();
        const transferDate = transfer.date;
        const timeDiffMinutes = (now - transferDate) / (1000 * 60); 

        if (timeDiffMinutes > 5) {
            return res.status(400).json({ message: 'Timeout period expired. Transfer cannot be reverted.' });
        }

        const emisorUser = await User.findById(transfer.emisor);
        const receptorUser = await User.findById(transfer.receptor);

        if (!emisorUser || !receptorUser) {
            return res.status(404).json({ message: 'Emisor or Receptor not found' });
        }

        emisorUser.balance += transfer.amount;
        receptorUser.balance -= transfer.amount;
        transfer.reverted = true;

        await emisorUser.save();
        await receptorUser.save();
        await transfer.save();

        res.status(200).json({ message: 'Transfer reverted successfully', transfer });
    } catch (error) {

        res.status(500).json({ message: 'Error reverting transfer', error });
    }
};