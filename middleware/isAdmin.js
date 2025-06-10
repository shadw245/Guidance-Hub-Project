
module.exports.requireAdmin = function(req, res, next) {
    if (req.session && req.session.user && req.session.user.isAdmin) {
        return next();
    }
    res.status(403).send("Access denied. Admins only.");
};