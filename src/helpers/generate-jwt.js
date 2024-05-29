import jwt from 'jsonwebtoken';
import  token  from 'morgan';

export const generarJWT = (uid = ' ',email = ' ') => {
    return new Promise((resolve, reject) => {
        const playload = ({uid,email});

        jwt.sign(
            playload,
            process.env.SECRETPRIVATEKEY,{expiresIn: '5h'},
            (err,token) =>{
                err ? (console.log(err), reject('Could not generate a token')) : resolve(token);
            }
        );
    });
}