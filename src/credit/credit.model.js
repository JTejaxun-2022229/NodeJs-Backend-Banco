import mongoose from "mongoose";

const CreditSchema = mongoose.Schema({

    // resove el id de usuario para guardar como tipo objeto
    userAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //Balance empieza siempre con 1000 ya que nunca se podra pedir menor a 1000 , al momento de solicitar creditos
    amount: {
        type: Number,
    },
    // Formato mm/m/aaaa
    description: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    /*El estado nos servira para que el administrador sepa cuales son los creditos en espera
    si cambia a falso es por que el credito fue aprobado*/
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "denied"]
    }
});

export default mongoose.model('Credit', CreditSchema)