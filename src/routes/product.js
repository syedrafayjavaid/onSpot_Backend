const express = require("express");
const { upload } = require("../common-middleware/common-middlewares");
const router = express.Router();
const { getProductsBySlug, searchProductByImage, getProductsByGenderAndEvent } = require("../controllers/product-controller");

router.get("/products/:slug", getProductsBySlug);

router.get("/products/:cat/:event", getProductsByGenderAndEvent);

router.post("/image-search",upload.single('queryImage'), searchProductByImage);

module.exports = router;
