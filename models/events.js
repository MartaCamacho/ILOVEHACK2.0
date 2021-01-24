const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {   
      name: String,
      creator: { type: Schema.Types.ObjectId, ref: "User"},
      date: Date,
      location: String,
      description: String,
      time: String,
      imgPath: String,
      isPublic: { type: Boolean, default: false},
      attending: [{ type: Schema.Types.ObjectId, ref: "User"}],
      cohort: {type: String, enum: ['web', 'data', 'ux', 'all']}
    },
    {
      timestamps: true,
    }
  );
  const Event = mongoose.model('Event', eventSchema);
  
  // createEvent = async() => {
  //   const name= 'Study session'
  //   const date = new Date()
  //   const location = 'Room 2'
  //   await Event.create({name, date, location})
  //   console.log(name, date, location)
  // }

  // createEvent()

  module.exports = Event;