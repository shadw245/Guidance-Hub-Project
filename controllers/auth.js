const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Signup Route
exports.signup = async (req, res) => {
  try {
    const { name, email, mobile,country,gender, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Save user to database
    const newUser = new User({ name, email, mobile, country, gender, password: hashedPassword });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // 🔐 Compare Hashed Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    res.json({ message: "Login successful!" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
};
