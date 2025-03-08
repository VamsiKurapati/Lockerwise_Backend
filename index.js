const express = require("express");
const cors = require("cors");
require("dotenv").config();

const emailRoute = require("./email");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://lockerwise.com",
    methods: ['POST'],  
    allowedHeaders: ['Content-Type'],
}));

app.use("/api", emailRoute);

app.get("/", (req, res) => {
    res.send("Welcome to the Lockerwise");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
