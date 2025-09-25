require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const adminRoute = require('./routes/admin/index.route');
const route = require('./routes/client/index.route');
const database = require('./config/database');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
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

// Cookie & Session (đúng cú pháp cho Express 4/5)
app.use(cookieParser('keyboard cat'));
app.use(session({
  secret: 'keyboard cat',        // nên để trong .env
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

// Flash (cần session)
app.use(flash());
app.use((req, res, next) => {
  // join thành chuỗi để dễ in trong view
  res.locals.success = req.flash("success").join(' ');
  res.locals.error = req.flash("error").join(' ');
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
// App Locals Variables
app.locals.prefixAdmin = system.prefixAdmin;

// Routes
adminRoute(app);
route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
