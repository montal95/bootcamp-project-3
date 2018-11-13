const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new PlanSchema object
const PlanSchema = new Schema({
  // `title` is of type String
  description: { type: String, required: true },
  // `location` is of type String
  location: { type: String, required: true },
  // `startTime` is of type Date
  startTime: {type:Date, required:true, default:Date.now(), unique:true},
  // `endTime` is of type Date
  endTime: {type:Date, required:true}
});

// This creates our model from the above schema, using mongoose's model method
const Plan = mongoose.model("Plan", PlanSchema);

// Export the Plan model
module.exports = Plan;
