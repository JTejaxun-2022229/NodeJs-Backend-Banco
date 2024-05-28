import { model, Schema } from 'mongoose';

const BenefitSchema = Schema({

    nameBenefit: {

        type: String,
        required: true,
        unique: true
    },
    descriptionBenefit: {

        type: String,
        required: true
    },
    stock: {

        type: Number,
        required: true
    },
    price: {

        type: Number,
        required: true
    },
    image: {

        type: String,
        default: 'none'
    },
    status: {

        type: Boolean,
        default: true
    }
});

export default model('Benefit', BenefitSchema);