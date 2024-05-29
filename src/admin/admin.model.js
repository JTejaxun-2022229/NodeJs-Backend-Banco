import mongoose, {Schema} from 'mongoose';

const AdminSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    role:{
        type: String,
        default: 'ADMIN_ROLE'
    },
    status:{
        type: Boolean,
        default: true
    }
})

AdminSchema.methods.toJSON = function(){
    const { __v, password, _id, ...admin} = this.toObject();
    admin.Admin_id = _id;
    return admin;
}

export default mongoose.model('Admin', AdminSchema)