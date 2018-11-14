require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

//Middle-ware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "client", "build")));

const userRoutes = require("./routes/user.js");
app.use(userRoutes);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/inhabitMongo",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, function() {
  console.log("Connected on PORT: http://localhost:" + PORT);
});
