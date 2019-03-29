function log(req, resp, next) {
    console.log(`Received a request to url "${req.url}" with method "${req.method}"`);
    next();
}

module.exports = log;