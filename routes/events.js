var express = require("express");
var router = express.Router();
const Event = require("../models/events");
const uploadCloud = require("../config/cloudinary");


//ADD EVENT

router.post(
  "/add-event",
  uploadCloud.single("imgPath"),
  async (req, res, next) => {
    const { name, creator, imgPath, description, date, time, location, isAttending, isPublic, cohort } = req.body;
// ANOTHER ROUTE TO UPLOAD THE PICTURE WILL GO BELOW
    
    console.log(imgPath)
    // var cuteDate = date.toLocaleDateString("es-ES");

    try {
      // const event = await Event.findOne({ name });
      // if (event !== null) {
      //   res.render("events/add-event", {
      //     errorMessage: "This event already exists!",
      //   });
      //   return;
      // }

      // const imgPath = req.file.url;

      const newEvent = await Event.create({
        name,
        date,
        time,
        location,
        description,
        imgPath,
        isPublic, 
        cohort,
        creator
      });

      if(isAttending){
        await Event.findByIdAndUpdate(newEvent._id, {$addToSet:{attending: req.session.currentUser}})
      }

      res.status(200).json(newEvent)
    } catch (error) {
      next(error);
    }
  });

 router.post("/uploadpicture", uploadCloud.single("imgPath"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
});

  //ALL EVENTS LIST

router.get("/all-events", async (req, res, next) => {
  const allEvents = await Event.find().populate('attending')
  res.status(200).json(allEvents)
});

//EVENT DETAILS

router.get("/event-details/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const theEvent = await Event.findById(id).populate('attending')
    res.json( theEvent );
  } catch (error) {
    console.log(error)
  }
  
 
});

//EDIT EVENT INFORMATION

router.put("/edit/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, imgPath, description, date, time, location, isAttending, cohort, isPublic } = req.body;
    const eventEdited = await Event.findByIdAndUpdate(id, {$set: {name, imgPath, description, date, time, location, isAttending, cohort, isPublic }}) 
    res.status(200).json(eventEdited)
  } catch (error) {
    console.log(error)
  }
    
  });

// EDIT EVENT PICTURE
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
    console.log(user_id)
    console.log(event_id)
      const willAttend = await Event.findByIdAndUpdate(
        event_id,
        { $addToSet: { attending: user_id } },
        { new: true }
      )
      res.json(willAttend);
  } catch (error) {console.log(error)}
});


module.exports = router;
