const express = require("express");
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const db = require("../models");
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

//route used to retrieve user information with necessary fields only
router.get("/api/plans/:id", function (req, res) {
  db.User.findOne({
    'local.username': req.params.id
  })
    .populate("plan")
    .then(function (response) {
      console.log(response);
      res.json(response);
    })
    .catch(function (err) {
      res.json(err);
    });
});

//route used to create a user
router.post("/api/user", function (req, res) {
  console.log("\ntesting req.body");
  console.log(req.body);
  // console.log("\ntesting req.body.accounts");
  // console.log(req.body.accounts);

  // const newUser = { firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email };
  // console.log("\ntesting newUser");
  // console.log(newUser);
  console.log("==================================================");

  db.User.create(req.body, function (err, response) {
    console.log("\ntesting response after attemping to create new user in User db");
    console.log(response);
    if (err) {
      return res.json(err);
    }
    else {
      console.log("\nelse condition to findOneAndUpdate");

      return res.json(response);

      // console.log("\ntesting response._id ");
      // console.log(response._id);

      // console.log("\ntesting newUser.email");
      // console.log(newUser.email);

      // const accounts = req.body.accounts;
      // console.log("\ntesting accounts");
      // console.log(accounts);

      // db.Account.create(accounts)
      //   .then(function (dbAccount) {
      //       console.log("\ntesting dbAccount");
      //       console.log(dbAccount);
      //       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      //       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      //       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      //       return db.User.findOneAndUpdate({ _id: response._id }, { $push: { "accounts": dbAccount } }, { new: true });
      //   })
      //   .then(function (dbUser) {
      //       // If we were able to successfully update an Article, send it back to the client
      //       console.log("\n\ntesting dbUser");
      //       console.log(dbUser);
      //       res.json(dbUser);
      //   })
      //   .catch(function (err) {
      //       // If an error occurred, send it to the client
      //       console.log("\n\nWARNING - error found");
      //       console.log(err);
      //       res.json(err);
      //   });

      // db.User.findOneAndUpdate(
      //   { _id: response._id },
      //   { $push: { "accounts": { type: accounts.type, username: accounts.username, password: accounts.password } } },
      //   { new: true })
      //   .then(function (dbUser) {
      //     res.send("User successuflly added to db");

      //   })
      //   .catch(function (err) {
      //     // If an error occurred, send it to the client
      //     console.log("\n\n WARNING: error found");
      //     console.log(err);
      //     res.json(err);
      //   });
    }
  });
});

//route used to login - return as a boolean
router.post("/login", function (req, res) {
  console.log("login route hit");
  console.log("Line 101 of routes/user.js - testing req.body");
  console.log(req.body);
  console.log("=========");

  db.User.findOne({ 'local.username': req.body.username }, function (err, response) {
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
      return res.json(user);
    });
  });
});

//used to post a plan and assign its _id to the user
router.post("/api/user/:id", function (req, res) {
  db.Plan.create(req.body).then(function (dbPlan) {
    // console.log(dbNote);
    console.log(req.body);
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
router.delete("/api/user/:id", function(req, res) {
  db.User.remove({ _id: req.params.id }, function(err, response) {
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
  console.log("testing process.env.REACT_APP_GOOGLE_CLIENT_ID");
  console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID);

  console.log("testing idtoken");
  console.log(idtoken);

  verify(idtoken).catch(console.error);

  async function verify(token) {

    //The verifyIdToken function verifies the JWT signature, the aud claim, the exp claim, and the iss claim.
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
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
      const firstName = payload['given_name'];
      const lastName = payload['family_name'];

      console.log("\ntesting paylod var");
      console.log(payload);

      console.log("\ntesting userid var");
      console.log(userid);
      console.log("\ntesting name var");
      console.log(name);
      console.log("\ntesting firstName var");
      console.log(firstName);
      console.log("\ntesting lastName var");
      console.log(lastName);

      console.log("\ntesting email var");
      console.log(email);
      console.log("\ntesting token var");
      console.log(token);

      // If request specified a G Suite domain:
      //const domain = payload['hd'];

      // Search for Google User in the database based on their userid
      db.User.findOne({ email: email, 'google.id': userid })
        .then(existingUser => {
          console.log("\n\ntesting existingUser var");
          console.log(existingUser);

          // Google User not found in db, attempting to create new entry in db using Google User's info received from Google Auth server
          if (!existingUser) {
            console.log("Google User not found in database, creating new entry in database for this google user");

            new db.User({
              email: email,
              firstname: firstName,
              lastname: lastName,
              google: {
                id: userid,
                token: token
              }
            }).save().then(function (err, response) { return json(response) });

            // const googleUser = {
            //   email: email,
            //   firstname: firstName,
            //   lastname: lastName,
            //   google: {
            //     id: userid,
            //     token: token
            //   }
            // }
            // console.log("\ntesting googleUser");
            // console.log(googleUser);

            // db.User.create(googleUser, function (err, response) {
            //   if (err) {
            //     return res.json(err);
            //   }
            //   return res.json(response);
            // });
          } else {
            console.log("Google User already exists in db, no need to create new entry");
          }
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          res.json(err);
        });;

    }


  }
});

router.get("/api/googleclientid", function (req, res) { 
  return res.json(process.env.REACT_APP_GOOGLE_CLIENT_ID);
 });


//route used to delete plan from planDB
router.delete("/api/plans/:id", function(req, res) {
  db.Plan.remove(
    {
      _id: req.params.id
    },
    function(err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(response);
        res.json(response);
      }
    }
  );
});

module.exports = router;
