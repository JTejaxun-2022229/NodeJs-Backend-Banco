'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js'
import benefitRoutes from '../src/benefit/benefit.routes.js'

// si van a usar un path para una entidad que sea de esta manera
//  '/quetzalito/v1/{su entidad en singular}'

class Server {

    constructor() {

        this.app = express()
        this.port = process.env.PORT
        this.benefitPath = '/quetzalito/v1/benefit'

        this.middlewares()
        this.conectarDB()
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

        this.app.use(this.benefitPath, benefitRoutes)
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port)
        })
    }
}

export default Server