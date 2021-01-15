const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullname: String,
    password: String,
    birthdate: Date,
    gender: {type: String, enum: ['male', 'female', 'none']},
    email: String,
    description: String,
    imgPath: String,
    answers: [String],
    isHorny: Boolean,
    matches: [{ type: Schema.Types.ObjectId, ref: "User"}],
    wants: {type: String, enum: ['study', 'sports', 'social']},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;