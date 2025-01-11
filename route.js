const express = require("express");
const ProductController = require("./controllers/productController");
const route = express.Router();

// route.post("/products", ProductController.productDetails);
route.get("/products", ProductController.products);
route.get("/productDetails", ProductController.productDetails);
// route.post("/orders", ProductController.orderDetails);
route.get("/orders", ProductController.orderDetails);
route.post("/saveproduct", ProductController.saveProduct);
route.post("/deleteproduct", ProductController.productDeleteById);
route.post("/updateproductimage", ProductController.productUpdateByImage);

module.exports = route;
