import bcryptjs from 'bcryptjs';
import User from './user.model.js'
import {response} from 'express'

export const userPost = async (req, res) => {
    console.log('userPost');

    const {name,username,DPI,address,phone,email,password,workPlace,salary,balance} = req.body;
    const role = 'USER_ROLE';
    const user = new User({name,username,DPI,address,phone,email,password,workPlace,salary,balance,role});

    const salt =bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password,salt);

    await user.save();

    res.status(200).json({
        user
    })
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        res.status(200).json({
            users
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
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
    const { email, currentPassword, name, username, address, phone, newPassword, workPlace, salary, balance } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                msg: 'El correo electrónico que ingresaste no existe en la base de datos'
            });
        }

        const validPassword = bcryptjs.compareSync(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Clave incorrecta'
            });
        }

        const updateFields = { name, username, address, phone, workPlace, salary, balance };

        if (newPassword) {
            const salt = bcryptjs.genSaltSync();
            updateFields.password = bcryptjs.hashSync(newPassword, salt);
        }

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

export const deleteUser = async(req, res) => {
    const{email,password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).json({
            msg: 'The email you entered does not exist in the database'
        });
    }

    const salt = bcryptjs.genSaltSync();
    const validPassword = bcryptjs.compareSync(password, user.password);
    

    if(!validPassword){
        return res.status(400).json({
            msg: 'Clave incorrecta'
        });
    }

    user.state=false;

    const usuario = await User.findByIdAndUpdate(user.id, user, { new: true });

    res.status(200).json({
        msg: 'This user is eliminated',
        usuario
    });
}