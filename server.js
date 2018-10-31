const express = require("express");
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || 8080;

//Middle-ware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("client/public"));

const userRoutes = require("./routes/user.js");
app.use(userRoutes);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/inhabitMongo"
);

app.listen(PORT, function() {
  console.log("Connected on PORT: http://localhost:" + PORT);
});