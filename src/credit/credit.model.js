import mongoose from "mongoose";

const CreditSchema = mongoose.Schema({

    // resove el id de usuario para guardar como tipo objeto
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    //Balance empieza siempre con 1000 ya que nunca se podra pedir menor a 1000 , al momento de solicitar creditos
    balance: {
        type: Number,
        default: 1000
    },
    // Formato mm/m/aaaa
    fecha: {
        type: Date,
    },

    description: {
        type: String
    },

    /*El estado nos servira para que el administrador sepa cuales son los creditos en espera
    si cambia a falso es por que el credito fue aprobado*/
    estado: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model('Credit', CreditSchema)
