const express       = require('express');
const morgan        = require('morgan');
const cors          = require('cors');
const createError   = require('http-errors');
const path          = require('path');
const cookieParser  = require('cookie-parser');
// const bodyParser    = require('body-parser');      // npm i body-parser is popular, too

const app           = express();

// Reads `.env` file and adds sets on process.env
require('dotenv').config();

// -------------------------------------------------------------------------------------------------------------------
// import API routes
const apiAuthRoutes       = require('./routes/api/apiAuthRoutes');
const apiUserRoutes       = require('./routes/api/apiUserRoutes');

// import routes
const indexRoutes         = require('./routes/indexRoutes');      // Left over from generate-express
const loginRoutes         = require('./routes/loginRoutes');
const registrationRoutes  = require('./routes/registrationRoutes');

// -------------------------------------------------------------------------------------------------------------------
// ENV
const port          = process.env.PORT          || 8000;
const clientPort    = process.env.CLIENT_PORT   || 3003;

// -------------------------------------------------------------------------------------------------------------------
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// -------------------------------------------------------------------------------------------------------------------
// Middlewares

app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(cors()); // allows all origins
if ((process.env.NODE_ENV = 'development')) {
  // TODO: dont full path
  app.use(cors({ origin: `http://localhost:${clientPort}` }));
}


// -------------------------------------------------------------------------------------------------------------------
// API Routes
app.use('/api',         apiAuthRoutes);
app.use('/api',         apiUserRoutes);

// Routes
app.use("/login",       loginRoutes);
app.use("/register",    registrationRoutes);
app.use('/',            indexRoutes);

// -------------------------------------------------------------------------------------------------------------------
// Error handling

// catch 404 and forward to error handler
app.use(_404);

// error handler
app.use(errorHandler);

// -------------------------------------------------------------------------------------------------------------------
// Start

app.listen(port, () => {
  console.log(`Running on port ${port}: / and /api`);
});


// -------------------------------------------------------------------------------------------------------------------
// functions

function _404(req, res, next) {
  next(createError(404));
}

function errorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}
