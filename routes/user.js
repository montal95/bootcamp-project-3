const express = require("express");
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const db = require("../models");
const client = new OAuth2Client("569221994230-gsskgd8m5ih82q3qhk648vple0e5md0q.apps.googleusercontent.com");

//route used to retrieve user information with necessary fields only
router.get("/api/plans/:id", function (req, res) {
  db.User.findOne({
    _id: req.params.id
  })
    .populate("plan")
    .then(function (response) {
      res.json({
        username: response.username,
        id: response._id,
        plan: response.plan
      });
    })
    .catch(function (err) {
      res.json(err);
    });
});

//route used to create a user
router.post("/api/user", function (req, res) {
  console.log("testing req.body");
  console.log(req.body);
  console.log("=========");

  db.User.create(req.body, function (err, response) {
    if (err) {
      return res.json(err);
    }
    return res.json(response);
  });
});

//route used to login - return as a boolean
router.post("/login", function (req, res) {
  console.log("login route hit");
  console.log("Line 42 of routes/user.js - testing req.body");
  console.log(req.body);
  console.log("=========");

  db.User.findOne({ username: req.body.username }, function (err, response) {
    if (err) {
      console.log("error with login");
      console.log(err);
      return res.json(err);
    }
    response.comparePassword(req.body.password, function (error, user) {
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
router.post("/api/user/:id", function (req, res) {
  db.Plan.create(req.body).then(function (dbPlan) {
    // console.log(dbNote);
    return db.User.findOneAndUpdate(
      {
        _id: req.params.id
      },
      { $push: { plan: dbPlan._id } },
      { new: true }
    )
      .then(function (dbNote) {
        res.json(dbNote);
      })
      .catch(function (err) {
        res.json(err);
      });
  });
});

//route used to delete user
router.delete("/api/user", function (req, res) {
  db.User.remove({ _id: req.params.id }, function (err, response) {
    if (err) {
      console.log(err);
    } else {
      res.json(response);
    }
  });
});

router.post("/api/tokensignin", function (req, res) {
  console.log("====================================")
  console.log("token sign in backend route hit");
  console.log("====================================\n")
  console.log(req.body);

  const { idtoken } = req.body;

  console.log("testing idtoken");
  console.log(idtoken);

  verify(idtoken).catch(console.error);
});

async function verify(token) {

  //The verifyIdToken function verifies the JWT signature, the aud claim, the exp claim, and the iss claim.
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: "569221994230-gsskgd8m5ih82q3qhk648vple0e5md0q.apps.googleusercontent.com",  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  console.log("\ntesting ticket var");
  console.log(ticket);

  // If ticket has data then it got a valid response back from the Google Auth server when it verified the Google User's token id
  if (ticket) {

    const payload = ticket.getPayload();

    const userid = payload['sub'];
    const email = payload['email'];
    const name = payload['name'];

    console.log("\ntesting paylod var");
    console.log(payload);

    console.log("\ntesting userid var");
    console.log(userid);
    console.log("\ntesting email var");
    console.log(email);

    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    // Search for Google User in the database based on their userid
    db.User.findOne({ username: userid })
      .then(existingUser => {
        console.log("testing existingUser var");
        console.log(existingUser);

        // Google User not found in db, attempting to create new entry in db using Google User's info received from Google Auth server
        if (!existingUser) {
          console.log("Google User not found in database, creating new entry in database for this google user");

          new db.User({
            username: userid,
            email: email,
            name: name,
            accountType: 'google'
          }).save();
          // db.User.create(req.body, function (err, response) {
          //   if (err) {
          //     return res.json(err);
          //   }
          //   return res.json(response);
          // });
        } else {
          console.log("Google User already exists in db");
        }
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });;

  }


}

module.exports = router;
