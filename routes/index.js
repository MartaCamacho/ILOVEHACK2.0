var express = require("express");
var router = express.Router();

const Event = require("../models/events.js");
const User = require("../models/user.js");
const Question = require("../models/questions.js");
const uploadCloud = require("../config/cloudinary");
const { findById, findByIdAndUpdate } = require("../models/user.js");

//GET USER

router.get("/", async (req, res, next) => {
  try {
    const theUser = await User.findById(req.session.currentUser)
    res.json(theUser)
  } catch (error) {
    console.log(error)
  }
});

//USER DETAILS



//GET ALL USERS
router.get("/allusers", async (req, res, next) => {
  try {
    const theUsers = await User.find()
    res.json(theUsers)
  } catch (error) {
    console.log(error)
  }
});

//GET QUESTIONS

router.get('/questions', async (req, res, next)=>{
  try {
    const theQuestions = await Question.find()
    res.json(theQuestions)
  } catch (error) {
    console.log(error)
  }
})

//EDIT USER

router.put("/edit", async (req, res, next) => {
  const {
    fullname,
    // password,
    // birthdate,
    // gender,
    email,
    description,
    // isHorny, 
    // searchFor,
    imgPath,
  } = req.body;

  try {
    // if (password.length < 8) {
    //   res.render("user/edit", {
    //     errorMessage: "Your password should have at least 8 characters",
    //   });
    //   return;
    // } else if (password !== repeatPassword) {
    //   res.render("user/edit", {
    //     errorMessage: "Your passwords are not matching",
    //   });
    //   return;
    // } else if (fullname.length === "") {
    //   res.render("user/edit", {
    //     errorMessage: "Your match will need to know how to call you ;)",
    //   });
    //   return;
    // } else if (description.length < 10) {
    //   res.render("user/edit", {
    //     errorMessage: "Tell your future match a bit more about yourself!",
    //   });
    //   return;
    // }
    // const salt = await bcrypt.genSaltSync(10);
    // const hashPass = await bcrypt.hashSync(password, salt);

    const updatedUser = await User.findByIdAndUpdate(
      req.session.currentUser._id,
      {
        $set: {
          fullname,
          // password: hashPass,
          // repeatPassword,
          // birthdate,
          // gender,
          email,
          description,
          // isHorny, 
          // searchFor,
          imgPath,
        },
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//edit user picture
router.post("/uploadpicture", uploadCloud.single("imgPath"), (req, res, next) => {
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  res.json({ secure_url: req.file.secure_url });
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id, 'is this all users' );
    const theUser = await User.findById(id).populate('attending')
    res.json( theUser );
  } catch (error) {
    console.log(error)
  }
  
 
});

// get user's answers

router.post('/answers', async (req, res, next) =>{
  const answers = req.body
  const theUser = await User.findByIdAndUpdate(req.session.currentUser._id, {$set: {answers}}) 
  res.json(theUser)
});


//delete account

router.delete("/delete", async (req, res, next) => {
  const deletedUser = await User.findByIdAndDelete({ _id: req.session.currentUser });
  res.json(deletedUser);
});

module.exports = router;