import bcryptjs from 'bcryptjs';
import User from './user.model.js'
import {response} from 'express'

export const userPost = async (req, res) => {
    console.log('userPost');

    const {name,username,account,DPI,address,phone,email,password,workPlace,salary,balance} = req.body;
    const role = 'USER_ROLE';
    const user = new User({name,username,account,DPI,address,phone,email,password,workPlace,salary,balance,role});

    const salt =bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password,salt);

    await user.save();

    res.status(200).json({
        user
    })
}

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