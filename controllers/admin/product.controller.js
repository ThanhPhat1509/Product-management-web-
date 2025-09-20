const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require('../../config/system'); // adjust path as needed
// get admin/products
module.exports.index = async (req, res) => {
    console.log('Vào controller admin product');
    const filterStatus = filterStatusHelper(req.query);
    let find = {
        deleted: false
    }
    if (req.query.status) {
        find.status = req.query.status;
    }
    const searchObject = searchHelper(req.query);
    if (searchObject.regex) {
        find.title = searchObject.regex;
    }

    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 8,
        },
        req.query,
        countProducts
    );

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);
    const newProducts = products.map(item => {
        const obj = item.toObject();
        obj.newPrice = (obj.price - (obj.price * obj.discountPercentage / 100)).toFixed(2);
        return obj;
    });
    console.log('objectPagination:', objectPagination);
    res.render("admin/pages/products/index", {
        pageTitle: "Trang san pham 100",
        products: newProducts,
        filterStatus: filterStatus,
        keyword: searchObject.keyword,
        pagination: objectPagination,
        prefixAdmin: systemConfig.prefixAdmin
    });

};
// patch admin/products/:id
module.exports.changeStatus = async (req, res) => {
    const { id, status } = req.params;
    const newStatus = status === "active" ? "not active" : "active";
    await Product.updateOne({ _id: id }, { status: newStatus });
    res.json({ status: newStatus });
};

module.exports.changeMultiple = async (req, res) => {
    try {
        console.log("=== changeMultiple called ===");
        console.log("Request body:", req.body);

        const type = req.body.type;
        let ids = req.body.ids ? req.body.ids.split(",") : [];

        console.log("Raw ids:", req.body.ids);
        console.log("Parsed ids:", ids);

        ids = ids.filter(id => id && id.trim() !== "");
        console.log("Filtered ids:", ids);

        let updateData = null;
        switch (type) {
            case "active":
                updateData = { status: "active" };
                break;
            case "not active":
                updateData = { status: "not active" };
                break;
        }

        console.log("Update type:", type);
        console.log("Update data:", updateData);

        if (updateData && ids.length > 0) {
            const result = await Product.updateMany(
                { _id: { $in: ids } },
                updateData
            );
            console.log("Update result:", result);
        } else {
            console.warn("No valid ids or updateData, skipping update.");
        }

        return res.redirect("/admin/products");

    } catch (err) {
        console.error("Error in changeMultiple:", err);
        return res.status(500).json({ error: "Server error" });
    }
};
