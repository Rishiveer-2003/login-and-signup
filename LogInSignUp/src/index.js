const express = require("express");
const app = express();
const path = require("path");
const collection = require("./mongodb");

const templatePath = path.join(__dirname, '../templates');

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static('public'));

// Added a GET route for the root path ("/") to render the login page
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// Added a GET route for the "/login" path to render the login page
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    await collection.insertMany([data]);

    res.render("home");
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });
        if (check.password === req.body.password) {
            res.render("home");
        } else {
            res.send('Wrong password');
        }
    } catch {
        res.send("Wrong details");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
