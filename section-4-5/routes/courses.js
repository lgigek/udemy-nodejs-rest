const express = require('express');
const router = express.Router();
const Joi = require('joi');

// mocked data
const courses = [
    {id: 1, name: 'one'},
    {id: 2, name: 'two'},
    {id: 3, name: 'three'}
];

let last_id = courses.length;

// route that returns all courses
router.get('/', (req, resp) => {
    resp.send(courses);
});

// route that returns a task by its id
router.get('/:id', (req, resp) => {
    let course = courses.find(value => value.id === parseInt(req.params.id));
    if (!course) return resp.status(404).send({message: 'The course was not found'});

    resp.send(course)
});

// route that adds a new course
router.post('/', (req, resp) => {
    let {error} = validate_course(req.body);
    if (error) return resp.status(400).send({message: error.details[0].message});

    const course = {
        id: last_id + 1,
        name: req.body.name
    };

    courses.push(course);
    resp.status(201).send(course)
});

// route that updates an existing course
router.put('/:id', (req, resp) => {
    let course = courses.find(value => value.id === parseInt(req.params.id));

    if (!course) return resp.status(404).send({message: 'The course was not found'});

    let {error} = validate_course(req.body); // { error } is the same as validate_course(req.body).error
    if (error) {
        resp.status(400).send({message: error.details[0].message});
    }

    course.name = req.body.name;
    resp.status(200).send(course);
});

// route that deletes an existing course
router.delete('/:id', (req, resp) => {
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

module.exports = router;