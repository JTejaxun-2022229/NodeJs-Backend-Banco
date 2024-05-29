'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import adminRoutes from '../src/admin/admin.routes.js';
import favoriteRoutes from '../src/favorite/favorite.routes.js';
import Admin from '../src/admin/admin.model.js';
import bcryptjs from "bcryptjs";



// si van a usar un path para una entidad que sea de esta manera
//  '/quetzalito/v1/{su entidad en singular}'

class Server {

    constructor() {

        this.app = express()
        this.port = process.env.PORT
        this.adminPath = '/quetzalito/v1/admin';
        this.favoritePath = '/quetzalito/v1/favorite';
        this.middlewares()
        this.conectarDB()
        this.createAdminIfNotExists() /* impornante llamarlo acá para que se ejecute el metodo al iniciar el proyecto*/
        this.routes()
    }

    async conectarDB() {

        await dbConnection()
    }

    middlewares() {

        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(morgan('dev'))
    }

    routes() {
        this.app.use(this.adminPath, adminRoutes);
        this.app.use(this.favoritePath, favoriteRoutes);
    }

    /* Metodo para crear un admin al iniciar el proyecto*/
    async createAdminIfNotExists() {
        try {
            const adminEmail = 'ADMINB@gmail.com'
            const adminPassword = 'ADMINB'

            let admin = await Admin.findOne({ email: adminEmail })

            if (!admin) {
                const AdminCreate = {
                    email: adminEmail,
                    password: adminPassword,
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

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port)
        })
    }
}

export default Server