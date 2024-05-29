import jwt from 'jsonwebtoken';
import { request, response } from 'express';
import User from '../user/user.model.js'

export const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'there is no token in the request'
        });
    }

    try{

        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY);
        const user = await User.findById(uid);

        if(!user){
            return res.status(401).json({
                msg: 'User does not exist in the database'
            })
        }

        if(!user.state){
            return res.status(401).json({
                msg: "Invalid token, user in false state"
            });
        }

        req.user = user;
        next()

    }catch(e){
        console.log(e);
        res.status(401).json({
            msg: "This token is not valid"
        })
    }
}