module.exports.requireInstructor = function(req, res, next) {
    if (req.session && req.session.user && req.session.user.isInstructor) {
        return next();
    }
    res.status(403).send("Access denied. Instructors only.");
};