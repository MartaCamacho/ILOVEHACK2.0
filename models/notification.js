const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
      event: { type: Schema.Types.ObjectId, ref: "Event"},
      match: { type: Schema.Types.ObjectId, ref: "User"},
        // mensaje de chat
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;