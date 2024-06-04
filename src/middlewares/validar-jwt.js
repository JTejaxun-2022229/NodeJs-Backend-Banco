import jwt from 'jsonwebtoken';
import { request, response } from 'express';

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