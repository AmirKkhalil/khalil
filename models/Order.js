const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    products: {
        type: Array
    }

});

module.exports = mongoose.model('Order', orderSchema);