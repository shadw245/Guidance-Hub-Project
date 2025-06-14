const express = require("express");
const router = express.Router();

const { signup, login, requireAdmin, requireInstructor } = require("../controllers/auth");

router.post("/signup", signup);
router.post("/login", login);

// GET routes for rendering pages
router.get("/signup", (req, res) => {
    res.render("login", { user: req.session.user });
});

router.get("/admin", requireAdmin, (req, res) => {
    res.render("website");
});

router.get("/interships", requireInstructor, (req, res) => {
    res.render("interships"); 
});

router.get("/api/auth/check-session", (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/website');
    });
});

module.exports = router;