const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
      return res.status(400).json({ message: "Invalid email or password" });    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) 
      return res.status(400).json({ message: "Invalid email or password" });    // Store only necessary user data in session
    req.session.user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: Boolean(user.isAdmin),
        isInstructor: Boolean(user.isInstructor)
    };

    console.log('User logged in:', req.session.user);

    let redirectPath = "/majors"; // Default
    if (user.isAdmin) redirectPath = "/admin";
    else if (user.isInstructor) redirectPath = "/interships"    
    res.json({ message: "Login successful!", redirect: redirectPath });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
};

exports.requireAdmin = async(req, res, next) => {
    if (!req.session || !req.session.user) {
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ message: "Unauthorized access. Please log in." });
        } else {
            return res.redirect('/login');
        }
    }
    const user = await User.findOne({ email:req.session.user.email });
    if (!user|| !user.isAdmin) {
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(403).json({ message: "Access denied. Admins only." });
        } else {
            return res.redirect('/login');
        }
    }
    next();
};

exports.requireInstructor = async (req, res, next) => {
    if (!req.session || !req.session.user) {
        // Check if this is an API request or page request
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ message: "Unauthorized access. Please log in." });
        } else {
            return res.redirect('/login');
        }
    }

    const user = await User.findOne({ email: req.session.user.email });
    if (!user || !user.isInstructor) {
        if (req.path.startsWith('/api/') || req.headers.accept?.includes('application/json')) {
            return res.status(403).json({ message: "Access denied. Instructors only." });
        } else {
            return res.redirect('/login');
        }
    }

    next(); 
};