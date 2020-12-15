var express = require("express");
var router = express.Router();
const Event = require("../models/events");
const uploadCloud = require("../config/cloudinary");


//ADD EVENT

router.post(
  "/add-event",
  uploadCloud.single("photo"),
  async (req, res, next) => {
    const { name, creator, description, date, location, isPublic, cohort } = req.body;
// ANOTHER ROUTE TO UPLOAD THE PICTURE WILL GO BELOW
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + dd + yyyy;
    if (date < today) {
      res.render("events/add-event", {
        errorMessage: "The event has to happen in the future :)",
      });
      return;
    } else if (name.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Your event name should have at least 5 characters",
      });
      return;
    } else if (description.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Write a longer description!",
      });
      return;
    } else if (location.length < 3) {
      res.render("events/add-event", {
        errorMessage:
          "People will need to know where to go! Tell them the place ^^",
      });
      return;
    }

    // var cuteDate = date.toLocaleDateString("es-ES");

    try {
      const event = await Event.findOne({ name: name, date: date });
      if (event !== null) {
        res.render("events/add-event", {
          errorMessage: "This event already exists!",
        });
        return;
      }

      const imgPath = req.file.url;

      const newEvent = await Event.create({
        name,
        date,
        location,
        description,
        imgPath,
        isPublic, 
        cohort,
        creator
      });
      res.status(200).json(newEvent)
    } catch (error) {
      next(error);
    }
  });

  //ALL EVENTS LIST

router.get("/all-events", function (req, res, next) {
  Event.find()
    .then((allTheEventsFromDB) => {
      console.log("Retrieved events from DB:", allTheEventsFromDB);
      res.json( allTheEventsFromDB );
    })
    .catch((error) => {
      next(error);
    });
});

//EVENT DETAILS

router.get("/event-details/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  Event.findById({ _id: id }).then((event) => {
    res.json( event );
  });
});

//EDIT EVENT INFORMATION

router.put(
  "/edit/:id",
  (req, res, next) => {
    const { name, description, date, location, isPublic, cohort, imgPath } = req.body;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + dd + yyyy;
    if (date < today) {
      res.render("events/add-event", {
        errorMessage: "The event has to happen in the future :)",
      });
      return;
    } else if (name.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Your event name should have at least 5 characters",
      });
      return;
    } else if (description.length < 5) {
      res.render("events/add-event", {
        errorMessage: "Write a longer description!",
      });
      return;
    } else if (location.length < 3) {
      res.render("events/add-event", {
        errorMessage:
          "People will need to know where to go! Tell them the place ^^",
      });
      return;
    }

    Event.findByIdAndUpdate(
      { _id: req.query.event_id },
      { $set: { name, description, date, location, isPublic, cohort, imgPath } }
    )
      .then((event) => { res.json(event) })
      .catch((error) => {
        console.log(error);
      });
  }
);

//EDIT EVENT PICTURE
router.post("/upload", uploadCloud.single("imgPath"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
});

//DELETE EVENT

router.delete("/delete/:id", async (req, res, next) => {
  const deletedEvent = await Event.findByIdAndDelete({ _id: req.params.id });
  res.json(deletedEvent);
});

// WILL ATTEND EVENTS

router.get("/fav", async (req, res, next) => {
  const userId = req.session.currentUser._id;
  try {
    const eventsCreated = await Event.find( {creator: userId} )
    const willGoEvents = await Event.find( {attending: {$in: [userId]}} )
    res.json( { eventsCreated, willGoEvents });
  } catch (error) {
    next(error);
    return;
  }
});

//WILL ATTEND BUTTON
router.post("/fav",  async (req, res, next) => {
  try {
    const { user_id, event_id } = req.body;

      const willAttend = await Event.findByIdAndUpdate(
        event_id,
        { $addToSet: { attending: user_id } },
        { new: true }
      )
      res.json(willAttend);
  } catch (error) {console.log(error)}
});


module.exports = router;
