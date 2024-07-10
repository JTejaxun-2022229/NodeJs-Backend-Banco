import Credit from "./credit.model.js";
import User from "../user/user.model.js"

export const createCredit = async (req, res) => {

    const { userAccount, amount, description } = req.body;

    try {

        const user = await User.findOne({ account: userAccount });
        if (!user) {
            return res.status(404).json({
                msg: 'User account not found'
            });
        }

        const newCredit = new Credit({
            userAccount: user._id,
            amount,
            description
        });

        await newCredit.save();

        res.status(201).json(newCredit);
    } catch (error) {

        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

export const authorizeCredit = async (req, res) => {
    const { creditId, status } = req.body;

    if (!['accepted', 'denied'].includes(status)) {
        return res.status(400).json({
            msg: 'Invalid status. Status must be either "accepted" or "denied".'
        });
    }

    try {
        const credit = await Credit.findById(creditId).populate('userAccount');
        if (!credit) {
            return res.status(404).json({
                msg: 'Credit not found'
            });
        }

        if (status === 'accepted' && credit.status === 'pending') {
            const user = await User.findById(credit.userAccount._id);
            user.balance += credit.amount;
            await user.save();
        }

        credit.status = status;
        await credit.save();

        res.json({
            msg: `Credit has been ${status}`,
            credit
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

export const getCredits = async (req, res) => {

    try {

        const credits = await Credit.find().populate('userAccount', 'account');
        const creditCount = credits.length;

        const result = credits.map(credit => ({
            id: credit._id,
            account: credit.userAccount.account,
            amount: credit.amount,
            description: credit.description,
            date: credit.date,
            status: credit.status
        }));

        res.json({
            totalCredits: creditCount,
            credits: result
        });
    } catch (error) {

        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

export const getCreditsByAccount = async (req, res) => {

    const { account } = req.params;
    
    try {

        const user = await User.findOne({ account });
        if (!user) {
            return res.status(404).json({
                msg: 'User account not found'
            });
        }

        const credits = await Credit.find({ userAccount: user._id }).populate('userAccount', 'account');
        const creditCount = credits.length;

        const result = credits.map(credit => ({
            account: credit.userAccount.account,
            amount: credit.amount,
            description: credit.description,
            date: credit.date,
            status: credit.status
        }));

        res.json({
            totalCredits: creditCount,
            credits: result
        });
    } catch (error) {

        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

export const getPendingCredits = async (req, res) => {

    try {

        const credits = await Credit.find({ status: "pending" }).populate('userAccount', 'account');
        const creditCount = credits.length;

        const result = credits.map(credit => ({
            id: credit._id,
            account: credit.userAccount.account,
            amount: credit.amount,
            description: credit.description,
            date: credit.date,
            status: credit.status
        }));

        res.json({
            totalCredits: creditCount,
            credits: result
        });
    } catch (error) {

        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

export const getAcceptedCredits = async (req, res) => {

    try {

        const credits = await Credit.find({ status: "accepted" }).populate('userAccount', 'account');
        const creditCount = credits.length;

        const result = credits.map(credit => ({
            id: credit._id,
            account: credit.userAccount.account,
            amount: credit.amount,
            description: credit.description,
            date: credit.date,
            status: credit.status
        }));

        res.json({
            totalCredits: creditCount,
            credits: result
        });
    } catch (error) {

        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

export const getDeniedCredits = async (req, res) => {

    try {

        const credits = await Credit.find({ status: "denied" }).populate('userAccount', 'account');
        const creditCount = credits.length;

        const result = credits.map(credit => ({
            id: credit._id,
            account: credit.userAccount.account,
            amount: credit.amount,
            description: credit.description,
            date: credit.date,
            status: credit.status
        }));

        res.json({
            totalCredits: creditCount,
            credits: result
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Server error',
            error
        });
    }
};

