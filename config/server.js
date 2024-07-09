'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import bcryptjs from "bcryptjs";
import { dbConnection } from './mongo.js'
import Admin from '../src/admin/admin.model.js';
import User from '../src/user/user.model.js';
import adminRoutes from '../src/admin/admin.routes.js';
import userRoutes from '../src/user/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import favoriteRoutes from '../src/favorite/favorite.routes.js';
import creditRouter from "../src/credit/credit.routes.js"
import benefitRoutes from "../src/benefit/benefit.routes.js"
import purchaseRoutes from "../src/purchase/purchase.routes.js"
import transferRoutes from "../src/transfer/transfer.routes.js"
import conversionsRoutes from '../src/conversions/conversions.routes.js'

// si van a usar un path para una entidad que sea de esta manera
//  '/quetzalito/v1/{su entidad en singular}'

class Server {

    constructor() {

        this.app = express()
        this.port = process.env.PORT

        this.userPath = '/quetzalito/v1/user';
        this.authPath = '/quetzalito/v1/auth';
        this.adminPath = '/quetzalito/v1/admin';
        this.favoritePath = '/quetzalito/v1/favorite';
        this.creditPath = '/quetzalito/v1/credit';
        this.benefitPath = '/quetzalito/v1/benefit';
        this.purchasePath = '/quetzalito/v1/purchase';
        this.transferPath = '/quetzalito/v1/transfer'
        this.convertPath = '/quetzalito/v1/convert'

        this.middlewares()
        this.conectarDB()
        this.routes()
        this.createAdminIfNotExists()
        this.createUserIfNotExists()
    }

    async conectarDB() {

        await dbConnection()
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes() {
        this.app.use(this.userPath, userRoutes)
        this.app.use(this.authPath, authRoutes)
        this.app.use(this.adminPath, adminRoutes)
        this.app.use(this.favoritePath, favoriteRoutes)
        this.app.use(this.creditPath, creditRouter)
        this.app.use(this.benefitPath, benefitRoutes)
        this.app.use(this.purchasePath, purchaseRoutes)
        this.app.use(this.transferPath, transferRoutes)
        this.app.use(this.convertPath, conversionsRoutes)
    }

    async createAdminIfNotExists() {
        try {
            const adminEmail = 'ADMINB@gmail.com'
            const adminPassword = 'ADMINB'

            let admin = await Admin.findOne({ email: adminEmail })

            if (!admin) {
                const AdminCreate = {
                    name: "Fernando",
                    DPI: "1234567891011",
                    email: adminEmail,
                    password: adminPassword,
                    phone: "12345678",
                    address: "Ciudad de Guatemala"
                };

                const saltAdmin = bcryptjs.genSaltSync();
                AdminCreate.password = bcryptjs.hashSync(AdminCreate.password, saltAdmin);

                const adminDefault = new Admin(AdminCreate);
                await adminDefault.save();
            }
        } catch (error) {
            console.error('Error creating admin:', error)
        }
    }

    async createUserIfNotExists() {
        try {
            const userEmail = 'user@gmail.com'
            const userPassword = '123456'

            let user = await User.findOne({ email: userEmail })

            if (!user) {
                const UserCreate = {
                    name: 'name1',
                    username: 'username1',
                    DPI: '12345678910',
                    address: 'Guatemala',
                    phone: '12345678',
                    email: userEmail,
                    password: userPassword,
                    workPlace: 'Kinal',
                    salary: '1800',
                    balance: '10000',
                };

                const saltUser = bcryptjs.genSaltSync();
                UserCreate.password = bcryptjs.hashSync(UserCreate.password, saltUser);

                const userDefault = new User(UserCreate);
                await userDefault.save();
            }
        } catch (error) {
            console.error('Error creating User:', error)
        }
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port)
        })
    }
}

export default Server