
const systemConfigRoute = require('../../config/system');

const dashboardRoute = require('./dashboard.route');
const productRoute = require('./product.route');
module.exports = (app) => {
    const ADMIN_PATH = systemConfigRoute.prefixAdmin;;
    app.use(ADMIN_PATH + '/dashboard', dashboardRoute);
    app.use(ADMIN_PATH + '/products', productRoute);
};

