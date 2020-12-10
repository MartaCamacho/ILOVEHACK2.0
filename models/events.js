const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {   
      name: String,
      creator: { type: Schema.Types.ObjectId, ref: "User"},
      date: Date,
      location: String,
      description: String,
      photo: String,
      isPublic: {Boolean, default: false},
      attending: [{ type: Schema.Types.ObjectId, ref: "User"}],
      cohort: {type: String, enum: ['Web', 'Data', 'UX', 'all']}
    },
    {
      timestamps: true,
    }
  );
  const Event = mongoose.model('Event', eventSchema);
  
  module.exports = Event;