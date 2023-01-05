const express = require("express");
const router = express.Router();
const {
	handleNewSupplier,
	handleDeleteSupplier,
	handleUpdateSupplier,
	handleGetSupplier,
	handleGetAllSuppliers,
} = require("../controllers/supplierController");

router.post("/add", handleNewSupplier);

router.delete("/delete/:id", handleDeleteSupplier);

router.put("/update/:id", handleUpdateSupplier);

router.get("/get/:id", handleGetSupplier);

router.get("/get-all", handleGetAllSuppliers);

module.exports = router;
