const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require('../../config/system'); // adjust path as needed
// get admin/products
module.exports.index = async (req, res) => {

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

    const products = await Product.find(find)
        .sort({ position: "asc" })
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip);
    const newProducts = products.map(item => {
        const obj = item.toObject();
        obj.newPrice = (obj.price - (obj.price * obj.discountPercentage / 100)).toFixed(2);
        return obj;
    });

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
        ids = ids.filter(id => id && id.trim() !== "");
        let updateData = null;

        switch (type) {
            case "active":
                updateData = { status: "active" };
                break;
            case "not active":
                updateData = { status: "not active" };
                break;
            case "delete-all":
                updateData = { deleted: true, deletedAt: new Date() };
                break;
            case "change-position":
                console.log("Changing positions for ids:", ids);
                for (const item of ids) {
                    let [id, position] = item.split("-");
                    position = parseInt(position);
                    await Product.updateOne({ _id: id }, { position: position });

                }
                return res.redirect("/admin/products");
        }

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

// delete admin/products/:id
module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    console.log('Deleting product with id:', id);
    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    res.redirect("/admin/products");
}