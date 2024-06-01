import mongoose, { Schema } from 'mongoose';

const FavoriteSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Enter a valid idUser"]
    },
    noAccount: {
        type: Number,
        required: true
    },
    DPI: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
});

FavoriteSchema.methods.toJSON = function() {
    const { __v, _id, ...favorite } = this.toObject();
    favorite.favorite_id = _id;
    return favorite;
};

export default mongoose.model('Favorite', FavoriteSchema);