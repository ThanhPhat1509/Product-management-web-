
const express = require('express');
const router = express.Router();
const multer = require('multer')
const storageMulter = require("../../helpers/storageMulter")

const upload = multer({ storage: storageMulter() })
const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate");
router.get('/', controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multiple", controller.changeMultiple);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.createProduct);
router.post(
    "/create",
    upload.single('thumbnail'),
    validate.createPost,
    controller.createPostProduct);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single('thumbnail'),
    controller.editPatch);

router.get("/detail/:id", controller.detail);
module.exports = router;