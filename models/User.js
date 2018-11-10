const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;

const userSchema = new Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  email: {
    type: String,
    required: true,
    index: { unique: true }
  },
  plan: [
    {
      type: Schema.Types.ObjectId,
      ref: "Plan"
    }
  ],
  local: {
    username: {
      type: String,
      unique: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: {
      type: String,
      unique: true
    },
    token: {
      type: String
    },
  }
});

userSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("local.password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    console.log("calling bcrypt generating salt");
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.local.password, salt, function (err, hash) {
      console.log("testing user.password:  " + user.local.password);
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.local.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
  console.log("candidatePassword:  " + candidatePassword);
  bcrypt.compare(candidatePassword, this.local.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
