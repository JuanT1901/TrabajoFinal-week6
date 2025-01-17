const express = require("express");
const routerUser = require("./user.router");
const routerCategory = require("./category.router");
const routerProduct = require("./product.router");
const routerCart = require("./cart.router");
const { verifyJWT } = require("../utils/verifyJWT");
const routerPurchase = require("./purchase.router");
const routerProductImg = require("./productImg.router");
const router = express.Router();

// colocar las rutas aquí
router.use("/users", routerUser);
router.use("/categories", routerCategory);
router.use("/products", routerProduct);
router.use("/cart", verifyJWT, routerCart);
router.use("/purchase", verifyJWT, routerPurchase);
router.use("/product_images", verifyJWT, routerProductImg);

module.exports = router;
