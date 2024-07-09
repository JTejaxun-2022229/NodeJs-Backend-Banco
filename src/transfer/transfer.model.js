import mongoose from "mongoose";

const transferSchema = new mongoose.Schema({

    emisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Emisor is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required']
    },
    receptor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Receptor is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    reverted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Transfer', transferSchema);