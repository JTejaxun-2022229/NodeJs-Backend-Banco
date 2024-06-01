import jwt from 'jsonwebtoken';
import token from 'morgan';

export const generarJWT = (uid = ' ', email = ' ', accountType = ' ') => {
    return new Promise((resolve, reject) => {
        const playload = ({ uid, email, accountType});

        jwt.sign(
            playload,
            process.env.SECRETPRIVATEKEY, { expiresIn: '5h' },
            (err, token) => {
                err ? (console.log(err), reject('Could not generate a token')) : resolve(token);
            }
        );
    });
}