if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./model/user');
const ExpressError = require('./Errors/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

const { scriptSrcUrls, connectSrcUrls, styleSrcUrls, fontSrcUrls, helmet } = require('./security/helmet')


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares_exxpress
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



// Mongoose local connection/DataBase
// 'mongodb://127.0.0.1:27017/yelpCamp'


// Mongoose cloud Database
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelpCamp';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

// connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error!, Check Connection'));
db.once('open', () => {
    console.log('Connected to Port Mongo cloud_yelpcamp')
});
// Mongo Session 
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on('error', function (e) {
    console.log('Error on Sesssion', e)
})



const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

// Security Measures
// Mongo Injection_sanitize
app.use(mongoSanitize({
    replaceWith: '_'
}));
// helmet
app.use(
    helmet({ contentSecurityPolicy: false })
    // helmet.contentSecurityPolicy({
    //     directives: {
    //         defaultSrc: [],
    //         connectSrc: ["'self'", { ...connectSrcUrls }],
    //         scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
    //         styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    //         workerSrc: ["'self'", "blob:"],
    //         objectSrc: [],
    //         imgSrc: [
    //             "'self'",
    //             "blob:",
    //             "data:",
    //             "https://res.cloudinary.com/dlnxtngyz/",
    //             "https://images.unsplash.com/",
    //         ],
    //         fontSrc: ["'self'", ...fontSrcUrls],
    //     },

    // })


);


// Passport && Passport_middlewaress
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

// Router
const campgroundsRouter = require('./Routes/campRoutes');
app.use('/campgrounds', campgroundsRouter);

const reviewRouter = require('./Routes/reviewRoutes');
app.use('/campgrounds/:id/review', reviewRouter);

const usersRouter = require('./Routes/usersRoutes');
app.use('/', usersRouter)

// Routes

app.get('/', (req, res) => {
    res.render('campgrounds/home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Error, Somethng Went wrong!';
    res.status(status).render('errors/error', { err });
})

const port = process.env.PORT || 3000
app.listen(port, (req, res) => {
    console.log(`Listening to Port ${port}`)
});
