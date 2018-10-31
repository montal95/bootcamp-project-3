const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/api/user", function(req, res) {
  res.send("Get Users");
});

router.post("/api/user", function(req, res) {
  db.User.create(req.body, function(err, response) {
    if (err) {
      return res.json(err);
    }
    return res.json(response);
  });
});

router.post("/login", function(req, res) {
  //echo route - testing to setup login - should send back original entry
  // console.log(req.body);
  // res.json(req.body);

  db.User.findOne({ username: req.body.username }, function(err, response) {
    if (err) {
      return res.json(err);
    }
    response.comparePassword(req.body.password, function(error, user) {
      if (error) {
        return res.json(error);
      }
      res.json(user);
    });
  });
});

router.put("/api/user", function(req, res) {
  res.send("Update Users");
});

router.delete("/api/user/:id", function(req, res) {
  res.send("Delete Users");
});

module.exports = router;
