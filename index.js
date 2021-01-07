const express = require('express');
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require('express-session');
const app = express();
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const orderRoutes = require('./routes/order');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const varMiddleware = require('./middleware/variables');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false
}));

app.use(varMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/order', orderRoutes);
app.use('/auth', authRoutes);


app.get("/courses", (req, res) => {
    res.render('courses', {
        title: 'Courses',
        isCourse: true
    });
});

const PORT = process.env.PORT || 3000;

async function start() {
    try {
        const url = `mongodb+srv://andrey:82deOTNyia1fSZo0@cluster0.fnlqh.mongodb.net/shop?retryWrites=true&w=majority`;
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });

        // const candidate = await User.findOne();

        // if (!candidate) {
        //     const user = new User({
        //         email: 'andrey@mail.ru',
        //         name: 'Andrey',
        //         cart: {
        //             items: []
        //         }
        //     });
        //     await user.save();
        // }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

start();