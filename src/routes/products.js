const express = require("express");
const productController = require("@controllers/product");
const router = express.Router();
const { isAuthenticated, isAuthorized } = require("@routes/auth");

router
  .route("/")
  .get(productController.listProducts)
  .post(isAuthenticated, isAuthorized, productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .put(isAuthenticated, isAuthorized, productController.updateProduct)
  .delete(isAuthenticated, isAuthorized, productController.deleteProduct);

module.exports = router;
