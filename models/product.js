const mongoose = require("mongoose");
const { supplierSchema } = require("./supplier");

const productSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	images: { type: [String], required: true },
	buyingPrice: { type: Number, required: true },
	sellingPrice: { type: Number, required: true },
	quantity: { type: Number, default: 1 },
	category: { type: String, required: true },
	supplier: { type: supplierSchema, required: true },
});

Product = mongoose.model("product", productSchema);

module.exports = { Product };
