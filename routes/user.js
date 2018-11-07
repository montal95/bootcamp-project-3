const express = require("express");
const router = express.Router();
const db = require("../models");

//route used to retrieve user information with necessary fields only
router.get("/api/plans/:id", function(req, res) {
  db.User.findOne({
    _id: req.params.id
  })
    .populate("plan")
    .then(function(response) {
      res.json({
        username: response.username,
        id: response._id,
        plan: response.plan
      });
    })
    .catch(function(err) {
      res.json(err);
    });
});

//route used to create a user
router.post("/api/user", function(req, res) {
  db.User.create(req.body, function(err, response) {
    if (err) {
      return res.json(err);
    }
    return res.json(response);
  });
});

//route used to login - return as a boolean
router.post("/login", function(req, res) {
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

//used to post a plan and assign its _id to the user
router.post("/api/user/:id", function(req, res) {
  db.Plan.create(req.body).then(function(dbPlan) {
    // console.log(dbNote);
    return db.User.findOneAndUpdate(
      {
        _id: req.params.id
      },
      { $push: { plan: dbPlan._id } },
      { new: true }
    )
      .then(function(dbNote) {
        res.json(dbNote);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
});

//route used to delete user
router.delete("/api/user", function(req, res) {
  db.User.remove({ _id: req.params.id }, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      res.json(response);
    }
  });
});

module.exports = router;
