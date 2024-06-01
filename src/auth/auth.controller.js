import bcryptjs from 'bcryptjs';
import User from '../user/user.model.js';
import Admin from '../admin/admin.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        const admin = await Admin.findOne({ email });

        if (!user && !admin) {
            return res.status(400).json({
                msg: 'Incorrect credentials'
            });
        }

        const account = user || admin;
        const accountType = user ? 'user' : 'admin';

        if (!account.state) {
            return res.status(400).json({
                msg: 'This account is not registered'
            });
        }

        const validPassword = bcryptjs.compareSync(password, account.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Incorrect password'
            });
        }

        const token = await generarJWT(account.id, account.email, accountType);

        res.status(200).json({
            msg: 'Access granted',
            account,
            token
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Contact administrator'
        });
    }
};
