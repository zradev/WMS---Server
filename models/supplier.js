const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true},
    email: { type: String, required: true },
});

Supplier = mongoose.model("supplier", supplierSchema);

module.exports = { Supplier, supplierSchema };