import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:['name of user']
    },
    username:{
        type:String,
        required:['username']
    },
    account:{
        type:String,
        required:['number of account']
    },
    DPI:{
        type:String,
        required:[`The user's personal identification document`]
    },
    address:{
        type:String,
        required:[`Provide the user's address`]
    },
    phone:{
        type:Number,
        required:['The number phone of user ']
    },
    email:{
        type:String,
        required:['The email of user']
    },
    password:{
        type:String,
        required:['The password email']
    },
    workPlace:{
        type:String,
        required:['Work of user']
    },
    salary:{
        type:Number,
        required:['Salary of user']
    },
    balance:{
        type:Number,
        required:['Balance of user']
    },
    role:{
        type:String,
        default: 'USER_ROLE'
    }
})

UserSchema.methods.toJSON = function(){
    const { __v, password, _id , ...user } = this.toObject();
    this.uid = _id;
    return user;
}

export default mongoose.model('User',UserSchema);