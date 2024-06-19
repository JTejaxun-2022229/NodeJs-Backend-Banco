import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../user/user.model.js'
import Admin from '../admin/admin.model.js'

export const validarJWT = async (req = request, res = response, next) => {

    let token = req.body.token || req.query.token || req.headers['authorization']

    if (!token) {

        return res.status(401).json({

            msg: 'there is no token in the request'
        });
    }

    try {

        token = token.replace(/^Bearer\s+/, '')

        const decoded = jwt.verify(token, process.env.SECRETPRIVATEKEY)

        req.user = decoded

    } catch (e) {

        console.log(e);

        res.status(401).json({

            msg: "This token is not valid"
        })
    }

    return next()

}

export const compareUser = async (id, token, res) => {

    try {
        const decodedToken = jwt.verify(token, process.env.SECRETPRIVATEKEY);
        const jwtId = decodedToken.uid;

        const user = await User.findById(jwtId);

        if (!user || !user.status) {
            return false;
        }

        return user._id.toString() === id;

    } catch (e) {
        console.log(e);
        return false;
    }
};

export const compareAdmin = async (id, token, res) => {

    try {
        const decodedToken = jwt.verify(token, process.env.SECRETPRIVATEKEY);
        const jwtId = decodedToken.uid;

        const admin = await Admin.findById(jwtId);

        if (!admin || !admin.status) {
            return false;
        }

        return admin._id.toString() === id;

    } catch (e) {
        console.log(e);
        return false;
    }
};