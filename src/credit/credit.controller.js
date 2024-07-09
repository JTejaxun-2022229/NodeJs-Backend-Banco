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

export const getCredits = async (req, res) => {

    try {

        const credits = await Credit.find().populate('userAccount', 'account');
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

