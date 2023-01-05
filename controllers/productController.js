const { Product } = require("../models/product");

const handleNewProduct = async (req, res) => {
	const duplicate = await Product.findOne({
		name: req.body.name,
	});
	if (duplicate)
		return res.status(409).send({
			message: "Product with this name already exists.",
		});
	try {
		await Product.create({ ...req.body });
		res.status(201).send({ message: "Product added successfully." });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleDeleteProduct = async (req, res) => {
	try {
		await Product.deleteOne({ _id: req.params.id });
		res.status(204).send({ message: "Product deleted successfully." });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleUpdateProduct = async (req, res) => {
	try {
		product = await Product.findOne({ _id: req.params.id });
		if (!product)
			return res.status(404).send({ message: "Product not found." });
		await product.updateOne(req.body, { runValidators: true });
		await product.save();
		res.status(200).send({ message: "Product updated successfully." });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleGetProduct = async (req, res) => {
	try {
		const product = await Product.findOne({ _id: req.params.id });
		res.json(product);
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleGetAllProducts = async (req, res) => {
	try {
		Product.find((err, val) => {
			if (err) {
				console.log(err);
			} else {
				res.json(val);
			}
		});
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

module.exports = {
	handleNewProduct,
	handleDeleteProduct,
	handleUpdateProduct,
	handleGetProduct,
	handleGetAllProducts,
};
