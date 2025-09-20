const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {

        // Fetch products from the database
        const products = await Product.find();

        // Calculate newPrice for each product
        const newProducts = products.map(item => {
            const obj = item.toObject(); // Convert Mongoose document to plain object
            obj.newPrice = (obj.price - (obj.price * obj.discountPercentage / 100)).toFixed(2);
            return obj;
        });

        res.render("client/pages/products/index", {
            pageTitle: "Trang san pham 1",
            products: newProducts
        });

};