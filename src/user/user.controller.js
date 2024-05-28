import bcryptjs from 'bcryptjs';
import User from './user.model.js'
import {response} from 'express'

export const getUserEmail = async (req, res) => {
    const { correo } = req.params;
 
    try {
        const user = await User.findOne({ email: correo });
 
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
 
        res.status(200).json({
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