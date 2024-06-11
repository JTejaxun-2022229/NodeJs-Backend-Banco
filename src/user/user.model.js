import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name of user']
    },
    username: {
        type: String,
        required: [true, 'username']
    },
    account: {
        type: Number,
        default: () => Math.floor(Math.random() * 1e10),
    },
    DPI: {
        type: String,
        required: [true, `The user's personal identification document`]
    },
    address: {
        type: String,
        required: [true, `Provide the user's address`]
    },
    phone: {
        type: Number,
        required: [true, 'The number phone of user']
    },
    email: {
        type: String,
        required: [true, 'The email of user'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'The password email']
    },
    workPlace: {
        type: String,
        required: [true, 'Work of user']
    },
    salary: {
        type: Number,
        required: [true, 'Salary of user']
    },
    balance: {
        type: Number,
        default: 0,
        required: [true, 'Balance of user']
    },
    role: {
        type: String,
        default: 'USER_ROLE'
    },
    status: {
        type: Boolean,
        default: true,
    }
});

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};

export default mongoose.model('User', UserSchema);