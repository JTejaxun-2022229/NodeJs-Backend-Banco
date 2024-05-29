import mongoose from "mongoose";

const transferSchema = mongoose.Schema({
    transfer:{type:Number},
    emisor:{type:Number},
    receptor:{type:Number},
    balance:{type:Number},
    date:{type:Date},
    description:{type:String},
    reserved:{type:Boolean}
})

export default mongoose.model('Transfer', transferSchema)