const express = require("express");
const router = express.Router();
const {
    handleNewProduct,
    handleDeleteProduct,
    handleUpdateProduct,
    handleGetProduct,
    handleGetAllProducts,
} = require("../controllers/productController");

router.post("/create", handleNewProduct);

router.delete("/delete/:id", handleDeleteProduct);

router.put("/update/:id", handleUpdateProduct);

router.get("/get/:id", handleGetProduct);

router.get("/get-all", handleGetAllProducts);

module.exports = router;