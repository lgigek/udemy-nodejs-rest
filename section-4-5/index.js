const express = require('express');
const config = require('config');

const logger = require('./middlewares/logger');

const courses = require('./routes/courses');
const home = require('./routes/home');

// creates express app
const app = express();

// sets the app to use routes
app.use('/api/courses', courses);
app.use('/', home);

// adds a middleware that enables get document from body of request
app.use(express.json());

// adds a logger middleware
app.use(logger);

// adds a middleware for static files located in 'public' folder
app.use(express.static('public'));

// Configuration based on 'config' folder
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`);

// Template engine
// Sets 'pug' as template engine
app.set('view engine', 'pug');
// Sets 'views' as folder for '.pug' files
app.set('views', './views');

// uses 3000 as default port if env variable is not defined
const port = process.env.APP_PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));

