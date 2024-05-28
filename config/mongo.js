'use strict'

import mongoose from 'mongoose';

export const dbConnection = async () => {

    try {

        mongoose.connection.on('error', () => {
            console.log('MongoDB | Could not be connect to mongodb')
            mongoose.disconnect();
        })
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Try connecting');
        })
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | Connected to mongoDB');
        })
        mongoose.connection.on('open', () => {
            console.log('MongoDB | Connected to database')
        })
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to MongoDB')
        })
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected')
        })

        await mongoose.connect(process.env.URI_MONGO, {

        });

    } catch (e) {
        console.log('Database connection failed', e)
    }
}