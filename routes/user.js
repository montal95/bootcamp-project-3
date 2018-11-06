const express = require("express");
const router = express.Router();
const db = require("../models");

//route used to get a specific users info
router.get("/api/users/:id", function(req, res) {
  db.User.findOne(req.body.id, function(err, response) {
    if (err) {
      return res.json(err);
    }
    return res.json(response);
  });
});

//route used to create a user
router.post("/api/user", function(req, res) {
  console.log("testing req.body");
  console.log(req.body);
  console.log("=========");

  db.User.create(req.body, function(err, response) {
    if (err) {
      return res.json(err);
    }
    return res.json(response);
  });
});

//route used to login
router.post("/login", function(req, res) {
  console.log("testing req.body");
  console.log(req.body);
  console.log("=========");

  db.User.findOne({ username: req.body.username }, function(err, response) {
    if (err) {
      console.log("error with login");
      console.log(err);
      return res.json(err);
    }
    response.comparePassword(req.body.password, function(error, user) {
      if (error) {
        console.log(error);
        return res.json(error);
      }
      console.log(user);
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
        "_id": req.params.id
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
  db.Article.remove({ _id: req.params.id }, function(err, response) {
    if (err) {
      console.log(err);
    } else {
      res.json(response);
    }
  });
});

module.exports = router;
