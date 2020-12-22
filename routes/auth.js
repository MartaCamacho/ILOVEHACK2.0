const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/user");
const uploadCloud = require("../config/cloudinary");

const {
  isLoggedIn,
  isNotLoggedIn,
  validationLoggin,
} = require("../helpers/middleware");

// SIGN UP

router.post(
  "/signup", 
  /* uploadCloud.single("photo"), */
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { fullname, password, repeatPassword, birthdate, email, gender, description, isHorny, searchFor } = req.body;
  
    try {
      const emailExists = await User.findOne({ email }, "email");
      if (emailExists) {
        return next(createError(400))
      }
      else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPass = bcrypt.hashSync(password, salt);
        const imgPath = './defaultpic.jpg'
        const newUser = await User.create({ 
          fullname,
          password: hashPass,
          birthdate,
          gender,
          email,
          description,
          /* answers: [question1,
             question2,
             question3,
             question4,
             question5,
             question6,
             question7,
             question8,
             question9,
             question10], */
             isHorny, 
             searchFor,
            imgPath,
         });
        req.session.currentUser = newUser;
        res
          .status(200) 
          .json(newUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

//'/login'

router.post(
  "/login",
  isNotLoggedIn(),
  validationLoggin(),
  async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({errorMessage: 'email not valid'})
        next(createError(404, 'email not valid'));
      }
      else if (bcrypt.compareSync(password, user.password)) {
        req.session.currentUser = user;
        res.status(200).json(user);
        return;
      } else {
        res.status(401).json({errorMessage: 'password not valid'});
        next(createError(401, 'password not valid'));
      }
    } catch (error) {
      next(error);
    }
  }
);

 //log out
router.post("/logout", isLoggedIn(), (req, res, next) => {
  req.session.destroy();
  res
    .status(204)
    .send()
    .json({ message: " User is logged out" });
  return;
});

// GET '/me'

router.get("/me", isLoggedIn(), (req, res, next) => {
  req.session.currentUser.password = "*";
  res.json(req.session.currentUser);
});

module.exports = router;