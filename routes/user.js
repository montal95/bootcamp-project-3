const express = require("express");
const router = express.Router();

// const router = require("express").Router();

router.get("/api/user", function(req,res) {
    res.send("Get users");
});

router.post("/api/user", function(req,res) {
    res.send("Post users");
});

router.put("/api/user/:id", function(req,res) {
    res.send("Update users");
});

router.delete("/api/user/:id", function(req,res) {
    res.send("Delete users");
});

module.exports = router;
