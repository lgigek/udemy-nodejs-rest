const express = require('express');
const router = express.Router();

router.get('/', (req, resp) => {
    resp.render('index', {
        title: 'This is my title',
        message: 'This is my message'
    })
});

module.exports = router;