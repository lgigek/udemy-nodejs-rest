const mongoose = require("mongoose");

// Connects to MongoDb, using 'playground' db
mongoose.connect('mongodb://db:27017/playground', {useNewUrlParser: true})
    .then(() => console.log('Successfully connected to MongoDb'))
    .catch(err => console.log(`There was an error while connecting to MongoDb: ${err}`));

// Creates the schema, defining the document format
const course_schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    category: {
        type: String,
        enum: ['web', 'mobile', 'app']
    },
    author: String,
    tags: {
        type: Array,
        // Adds a custom validator
        validate: {
            validator: (v) => {
                return v && v.length > 0;
            },
            message: 'A course should have at least a tag'
        }
    },
    date: {type: Date, default: Date.now},
    is_published: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.is_published;   // price is required if 'is_published' is true
        },
        min: 10,
        max: 200,
        get: v => Math.round(v),    // getting document from mongo
        set: v => Math.round(v)     // inserting document to mongo
    }
});
// creates the model
const Course = mongoose.model('Course', course_schema);

// method that inserts a document into Mongo
async function create_course() {
    // Creates an instance of Course(model)
    let course = new Course({
        name: 'Node.js course',
        category: 'web',
        author: 'Mosh',
        tags: ['backend', 'web'],
        is_published: true,
        price: 15.8
    });

    // Approach #1
    // Use validateSync to verify if is valid before saving
    let error = await course.validateSync();
    if (error) return console.log(error.message);

    let result = await course.save();
    console.log(`insert document: ${result}`);
}

// method that updates a document according to its id
async function update_course(id) {
    // Approach #1
    // Updates the document without the necessity to manipulate it locally

    // Model.findOneAndUpdate -> returns the document with older values
    // Model.findOneAndUpdate(criteria, value, {new: true}) -> returns the document with newer values
    // Model.updateOne -> returns an object that informs the update status. Something like this:  { n: 1, nModified: 1, ok: 1 }
    let course = await Course.findOneAndUpdate({_id: id}, {
        $set: {
            author: 'Other author',
            is_published: true
        }
    }, {new: true});
    console.log(course);
}

// method that deletes a course according to its id
async function delete_course(id) {
    // Removes document from Db and returns it
    // Also, is possible to use delete, deleteOne, deleteMany
    let course = await Course.findOneAndDelete({_id: id});
    console.log(course)
}

// method that returns a course according to its id
async function find_course(id) {
    // returns the document
    let course = await Course.findOne({_id: id});
    console.log(course)
}

// method that returns all courses
async function find_all() {
    // returns all documents
    let courses = await Course.find();
    console.log(courses);
}

create_course();
// update_course('5ca3bbbccd61ea00119c2782');
// find_course('5ca3bbbccd61ea00119c2782');
// delete_course('5ca3bbbccd61ea00119c2782');
// find_all();


// another approach to insert a document
async function create_course_another_approach() {
    // Approach #2
    // Try to save and let mongoose verify if document is valid
    let course = new Course({
        name: 'Node.js course',
        category: 'web',
        author: 'Mosh',
        tags: ['node', 'backend'],
        is_published: true,
        price: 15
    });

    try {
        let result = await course.save();
        console.log(`insert document: ${result}`);
    } catch (ex) {
        for (let field in ex.errors)
            console.log(ex.errors[field]);
    }
}

// another approach to update a document
async function update_course_another_approach(id) {

    // Approach #2 to updates a document on mongo
    // Find, manipulate the object, save into mongo
    let course = await Course.findById(id);

    // Returns if course was not found
    if (!course) return;

    // Updating values
    // Approach #1 to set values to be updated
    /* course.is_published = true;
    course.author = 'Another author'; */

    // Approach #2 to se values to be updated
    course.set({
        is_published: true,
        author: 'Another author'
    });

    // Saves the course with new values
    let result = await course.save();
    console.log(result);
}