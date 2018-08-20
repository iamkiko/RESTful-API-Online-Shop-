const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // ref needed to configure type + creating a relation, just one as mongoDB is a non-relational DB
    quantity: { type: Number, default: 1 } //default: you don't need to pass a qty, falls back to default of 1
    
});

module.exports = mongoose.model('Order', orderSchema);