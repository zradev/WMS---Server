const { Supplier } = require("../models/supplier");

const handleNewSupplier = async (req, res) => {
	const duplicateName = await Supplier.findOne({
		name: req.body.name,
	});
	if (duplicateName)
		return res.status(409).send({
			message: "Supplier with this name already exists.",
		});

	const duplicateEmail = await Supplier.findOne({
		email: req.body.email,
	});
	if (duplicateEmail)
		return res.status(409).send({
			message: "Supplier with this name already exists.",
		});
	try {
		await Supplier.create({ ...req.body });
		res.status(201).send({ message: "Supplier added successfully." });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleDeleteSupplier = async (req, res) => {
	try {
		await Supplier.deleteOne({ _id: req.params.id });
		res.status(204).send({ message: "Supplier deleted successfully." });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleUpdateSupplier = async (req, res) => {
	try {
		supplier = await Supplier.findOne({ _id: req.params.id });
		if (!supplier)
			return res.status(404).send({ message: "Supplier not found." });
		await supplier.updateOne(req.body, { runValidators: true });
		await supplier.save();
		res.status(200).send({ message: "Supplier updated successfully." });
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleGetSupplier = async (req, res) => {
	try {
		const supplier = await Supplier.findOne({ _id: req.params.id });
		res.json(supplier);
	} catch (err) {
		res.status(500).send({ message: err.message });
	}
};

const handleGetAllSuppliers = async (req, res) => {
	try {
		Supplier.find((err, val) => {
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
	handleNewSupplier,
	handleDeleteSupplier,
	handleUpdateSupplier,
	handleGetSupplier,
	handleGetAllSuppliers,
};
