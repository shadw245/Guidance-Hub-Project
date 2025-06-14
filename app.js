const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const session = require("express-session");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({secret:"your-secret-key", resave: false, saveUninitialized: true}));


// Add middleware to make user available to all views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

mongoose.connect('mongodb://127.0.0.1:27017/Guidancehub')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const mentorshipRoutes = require("./routes/mentorships");
const internshipRoutes = require("./routes/internships");
const majorsRoutes = require('./routes/majors');
const chatRoutes = require('./routes/chat');

app.use("/api/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/mentorships", mentorshipRoutes);
app.use("/interships", internshipRoutes); 
app.use("/", adminRoutes);
app.use('/', majorsRoutes);
app.use('/chatbot', chatRoutes);

app.get(["/", "/website"], (req, res) => {
    res.render("website", { user: req.session.user });
});
app.get("/login", (req, res) => {
    res.render("login", { user: req.session.user });
});


app.get("/logout", (req, res) => {
    console.log('Logging out user:', req.session.user);
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Error logging out' });
        }
        res.redirect('/website');
    });
});

app.listen(8080, () => {
    console.log("Server is running on 8080");
});