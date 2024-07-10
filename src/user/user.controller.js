import bcryptjs from 'bcryptjs';
import User from './user.model.js';
import mongoose from 'mongoose';
import Transfer from '../transfer/transfer.model.js';
import Credit from '../credit/credit.model.js';
import Purchase from '../purchase/purchase.model.js';

export const userPost = async (req, res) => {
    console.log('userPost');

    const { name, username, DPI, address, phone, email, password, workPlace, salary, balance } = req.body;
    const role = 'USER_ROLE';
    const user = new User({ name, username, DPI, address, phone, email, password, workPlace, salary, balance, role });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    try {
        await user.save();

        res.status(200).json({
            user
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getUsers = async (req, res) => {
    const { start, end } = req.query;
    const query = { status: true };

    try {
        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(start))
                .limit(Number(end))
        ]);

        res.status(200).json({
            total,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getUsersOrder = async (req, res) => {
    const query = { status: true };
    const sortOrder = req.query.sort === 'asc' ? 1 : -1;

    try {
        const usersWithCounts = await User.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'credits',
                    localField: '_id',
                    foreignField: 'userAccount',
                    as: 'credits'
                }
            },
            {
                $lookup: {
                    from: 'purchases',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'purchases'
                }
            },
            {
                $lookup: {
                    from: 'transfers',
                    localField: '_id',
                    foreignField: 'emisor',
                    as: 'transfers'
                }
            },
            {
                $addFields: {
                    creditCount: { $size: '$credits' },
                    purchaseCount: { $size: '$purchases' },
                    transferCount: { $size: '$transfers' },
                    totalCount: { $sum: [{ $size: '$credits' }, { $size: '$purchases' }, { $size: '$transfers' }] }
                }
            },
            { $sort: { totalCount: sortOrder } },
            {
                $project: {
                    credits: 0,
                    purchases: 0,
                    transfers: 0
                }
            }
        ]);

        const totalUsers = await User.countDocuments(query);

        res.status(200).json({
            total: totalUsers,
            users: usersWithCounts
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const getMovements = async (req, res) => {
    const { id } = req.params;

    try {
        const credits = await Credit.find({ userAccount: id }).sort({ date: -1 }).limit(5).exec();
        const purchases = await Purchase.find({ user: id }).sort({ date: -1 }).limit(5).exec();
        const transfers = await Transfer.find({ emisor: id }).sort({ date: -1 }).limit(5).exec();

        const movements = [...credits, ...purchases, ...transfers].sort((a, b) => b.date - a.date).slice(0, 5);

        res.status(200).json({ movements });
    } catch (error) {
        console.error('Error fetching movements:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserEmail = async (req, res) => {
    const { correo } = req.query;

    try {
        const user = await User.findOne({ email: correo });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user,
            role: user.role,
            idUser: user._id
        });
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Request params:", req.params);
        console.log("Request body:", req.body);

        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                msg: 'Este usuario no existe en la base de datos'
            });
        }

        const { name, username, workPlace, address, phone, email, salary, balance } = req.body;

        const updateFields = { name, username, workPlace, address, phone, email, salary, balance };

        const updatedUser = await User.findByIdAndUpdate(user._id, updateFields, { new: true });

        res.status(200).json({
            msg: 'Usuario actualizado con éxito',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json({
                msg: 'Este usuario no existe en la base de datos'
            });
        }

        const updateFields = { status: false };

        const deleteUser = await User.findByIdAndUpdate(user._id, updateFields, { new: true });

        res.status(200).json({
            msg: 'Usuario Eliminado',
            user: deleteUser
        });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
};
