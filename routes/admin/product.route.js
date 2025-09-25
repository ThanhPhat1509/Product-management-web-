
const express = require('express');
const router = express.Router();
const controller = require("../../controllers/admin/product.controller");
router.get('/', controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multiple", controller.changeMultiple);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.createProduct);
router.post("/create", controller.createPostProduct);
module.exports = router;