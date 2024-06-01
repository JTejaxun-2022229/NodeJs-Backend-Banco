import mongoose, { Schema } from 'mongoose';

const AdminSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'ADMIN_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    }
});

AdminSchema.methods.toJSON = function () {
    const { __v, password, _id, ...admin } = this.toObject();
    admin.adminId = _id;
    return admin;
};

export default mongoose.model('Admin', AdminSchema);
