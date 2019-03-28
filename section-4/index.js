const Joi = require('joi');
const express = require('express');

// creates express app
const app = express();

// adds a middleware that enables get document from body of request
app.use(express.json());

// uses 3000 as default port if env variable is not defined
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started at port ${port}`));

// mocked data
const courses = [
    {id: 1, name: 'one'},
    {id: 2, name: 'two'},
    {id: 3, name: 'three'}
];

app.get('/', (req, resp) => {
    resp.send('Hello World');
});

// route that returns all courses
app.get('/api/courses', (req, resp) => {
    resp.send(courses);
});

// route that returns a task by its id
app.get('/api/courses/:id', (req, resp) => {
    let course = courses.find(value => value.id === parseInt(req.params.id));
    if (!course) return resp.status(404).send({message: 'The course was not found'});

    resp.send(course)
});

// route that adds a new course
app.post('/api/courses', (req, resp) => {
    let {error} = validate_course(req.body);
    if (error) return resp.status(400).send({message: error.details[0].message});

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    resp.status(201).send(course)
});

// route that updates an existing course
app.put('/api/courses/:id', (req, resp) => {
    let course = courses.find(value => value.id === parseInt(req.params.id));

    if (!course) return resp.status(404).send({message: 'The course was not found'});

    let {error} = validate_course(req.body); // { error } is the same as validate_course(req.body).error
    if (error) {
        resp.status(400).send({message: error.details[0].message});
    }

    course.name = req.body.name;
    resp.status(200).send(course);
});

app.delete('/api/courses/:id', (req, resp) => {
    let course = courses.find(value => value.id === parseInt(req.params.id));
    if (!course) return resp.status(404).send({message: 'The course was not found'});

    let index = courses.indexOf(course);
    courses.splice(index, 1);

    resp.send(course);
});

function validate_course(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

