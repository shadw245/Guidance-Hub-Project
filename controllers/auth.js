const User = require("../models/User");
const bcrypt = require("bcryptjs");
const redisClient = require("../app");

// Signup Route
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile,country,gender, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ message: "User already exists"});
  }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user to database
    const newUser = new User({ name, email, mobile, country, gender, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "Signup successful!"});
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) 
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: "Invalid email or password" });

   req.session.user = { email: user.email, isAdmin: user.isAdmin, isInstructor: user.isInstructor };

    let redirectPath = "/majors"; // Default
    if (user.isAdmin) redirectPath = "/admin";
    else if (user.isInstructor) redirectPath = "/interships"    
    res.json({ message: "Login successful!", redirect: redirectPath });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
};

exports.logout = async (req, res) => {
  try {

    req.session.destroy(err => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed!" });
      }
      res.redirect("/login"); 
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.requireAdmin = async (req, res, next) => {
    if (!req.session?.user || !req.session.user.isAdmin) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};

exports.requireInstructor = async (req, res, next) => {
    if (!req.session?.user || !req.session.user.isInstructor) {
        return res.status(403).json({ message: "Access denied. Instructors only." });
    }
    next();
};
