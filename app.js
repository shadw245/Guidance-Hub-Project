const express = require("express");
const path = require("path");
const app = express();
const mongoose = require('mongoose');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

mongoose.connect('mongodb://127.0.0.1:27017/Guidancehub')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
module.exports = app;

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views")); 


app.get("/", (req, res) => {
    res.render("website"); 
});

app.get("/website", (req, res) => {
    res.render("website");
});

app.get("/Accounting", (req, res) => {
    res.render("Accounting");
});

app.get('/Agricultural', (req, res) => {
    res.render('Agricultural');
});

app.get('/architecture', (req, res) => {
    res.render('architecture');
});
app.get('/Artificial-intelligence', (req, res) => {
    res.render('Artificial-intelligence');
});
app.get("/business", (req, res) => {
    res.render("business");
});

app.get('/chemical', (req, res) => {
    res.render('chemical');
});
app.get("/computer-science", (req, res) => {
    res.render("computer-science");
});
app.get("/cyber-security", (req, res) => {
    res.render("cyber-security");
});
app.get("/Data-Science", (req, res) => {
    res.render("Data-Science");
});
app.get("/electronics", (req, res) => {
    res.render("electronics");
});
app.get("/engineering", (req, res) => {
    res.render("engineering");
});

app.get("/Entrepreneurship", (req, res) => {
    res.render("Entrepreneurship");
});

app.get("/Finance", (req, res) => {
    res.render("Finance");
});

app.get("/HCI", (req, res) => {
    res.render("HCI");
});
app.get("/HumanResources", (req, res) => {
    res.render("HumanResources");
});
app.get("/Information-Systems", (req, res) => {
    res.render("Information-Systems");
});
app.get("/interships", (req, res) => {
    res.render("interships");
});
app.get("/IOT", (req, res) => {
    res.render("IOT");
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/majors", (req, res) => {
    res.render("majors");
});
app.get("/Marketing", (req, res) => {
    res.render("Marketing");
});

app.get("/mechanical", (req, res) => {
    res.render("mechanical");
});
app.get("/mentorships", (req, res) => {
    res.render("mentorships");
});

app.get("/software-development", (req, res) => {
    res.render("software-development");
});

app.get("/software-testing", (req, res) => {
    res.render("software-testing");
});
app.get("/SupplyChain", (req, res) => {
    res.render("SupplyChain");
});

app.listen(8080, () => {
    console.log("Server is running on 8080");
});