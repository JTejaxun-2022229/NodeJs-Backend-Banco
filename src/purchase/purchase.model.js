import mongoose from "mongoose";

const PurchaseSchema = mongoose.Schema({

    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    benefits: [{

        benefit: {

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Benefit',
            required: true
        },
        quantity: {

            type: Number,
            required: true
        }
    }],
    totalAmount: {

        type: Number,
        required: true
    },
    datePurchase: {

        type: Date,
        default: Date.now
    },
    refunded: {

        type: Boolean,
        default: false
    }
});

export default mongoose.model('Purchase', PurchaseSchema);