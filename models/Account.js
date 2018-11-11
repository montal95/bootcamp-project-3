const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;


// Using the Schema constructor, create a new PlanSchema object
const AccountSchema = new Schema({
  // Account type - either google or internal via form submission on the web app
  type: { type: String, required: true },
  // Internal accounts will have a username and password
  username: { type: String, unique: true },
  password: { type: String },
  // Google accounts will have their google ID stored instead
  googleid: { type: String, unique: true}

});


AccountSchema.pre("save", function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      console.log("testing user.password:  " + user.password);
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

AccountSchema.methods.comparePassword = function(candidatePassword, cb) {
  console.log("candidatePassword:  " + candidatePassword);
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// This creates our model from the above schema, using mongoose's model method
const Account = mongoose.model("Account", AccountSchema);

// Export the Account model
module.exports = Account;
