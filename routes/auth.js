const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/auth"); //  Grouped imports
const { requireAdmin } = require('../middleware/isAdmin'); // Fixed import
const { requireInstructor } = require('../middleware/isInstructor'); // Fixed import

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);

router.get("/api/auth/check-session", (req, res) => {
    if (req.session?.user) {
        res.json({ loggedIn: true, role: req.session.user.isAdmin ? "admin" : req.session.user.isInstructor ? "instructor" : "user" });
    } else {
        res.json({ loggedIn: false });
    }
});

router.get("/admin", requireAdmin, (req, res) => res.render("admin")); // ✅ Protects admin dashboard

router.get("/instructors", requireInstructor, (req, res) => res.render("instructorDashboard")); // ✅ Protects instructor dashboard

module.exports = router;
