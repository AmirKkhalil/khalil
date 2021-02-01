const mongoose = require('mongoose');

const productShema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    qte: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Product', productShema);