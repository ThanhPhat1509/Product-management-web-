require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');   
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');
const database = require('./config/database');
database.connect();
const system = require('./config/system');

const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));  


app.use(bodyParser.urlencoded({ extended: false }));
// App Locals Variables
app.locals.prefixAdmin = system.prefixAdmin;

// Routes
adminRoute(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
