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
    try {
        const { id, status } = req.params;
        const newStatus = status === "active" ? "not active" : "active";
        await Product.updateOne({ _id: id }, { status: newStatus });
        // flash phải đặt trước redirect
        req.flash("success", "Cập nhật trạng thái thành công");
        return res.redirect("/admin/products");
    } catch (err) {
        console.error("Error in changeStatus:", err);
        req.flash("error", "Có lỗi xảy ra khi cập nhật trạng thái");
        return res.redirect("/admin/products");
    }
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
            req.flash("success", "Cập nhật trạng thái thành công");
            return res.redirect("/admin/products");
        } else {
            req.flash("error", "Không có mục nào được chọn hoặc loại hành động không hợp lệ");
            return res.redirect("/admin/products");
        }




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
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("/admin/products");
}
// get admin/products/create
module.exports.createProduct = async (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "thêm mới sản phẩm"
    });
}

module.exports.createPostProduct = async (req, res) => {
    if (!q.req.body.title || !req.body.price || !req.body.discountPercentage || !req.body.stock) {
        req.flash("error", "Dữ liệu không hợp lệ");
        res.redirect("/admin/products");
        return;
    }
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);
    product.save();
    res.redirect("/admin/products");
}

