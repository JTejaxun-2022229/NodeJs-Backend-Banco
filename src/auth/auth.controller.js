import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                msg: 'Incorrect credentials'
            });
        }

        if(!user.state){
            return res.status(400).json({
                msg: 'This user is not registered'
            });
        }

        const validPassword = bcryptjs.compareSync(password, user.password);

        if(!validPassword){
            return res.status(400).json({
                msg: 'Incorrect password'
            });
        }

        const token = await generarJWT(user.id,user.correo);

        res.status(200).json({
            msg: 'Designed access',
            user,
            token
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            msg:'Contact administrator'
        });
    }
}