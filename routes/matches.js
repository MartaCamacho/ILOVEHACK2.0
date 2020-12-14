var express = require("express");
var router = express.Router();
const User = require("../models/user");

//comparing users

router.get(
  "/user/matches",
  async (req, res, next) => {
    try {
      //with this we find only the opposite sex:
      const allUsers = await User.find();
      const searchUser = await User.findById(req.session.currentUser._id);

      const genderArr = await allUsers.filter(
        (d) => d.gender === searchUser.searchFor
      );

      var points = (searchUser, usuario) => {
        var pts = 0;
        for (var i = 0; i < searchUser.answers.length; i++) {
          if (searchUser.answers[i] === usuario.answers[i]) pts++;
        }
        return pts;
      };

      const bestMatch = (searchUser, genderArr) => {
        const results = genderArr.filter((user) => {
          const pts = points(searchUser, user);
          if (pts >= 7) {
            return user;
          }
        });
        return results;
      };

      console.log(bestMatch(searchUser, genderArr));
      
      let matchList = bestMatch(searchUser, genderArr);

      res.render("user/matches", { matchList });
    } catch (error) {
      next(error);
      return;
    }
  }
);

router.post("/user/matches",  async function (req, res, next) {
  try {
    const user = await User.find();
  } catch (error) {

  }
});



module.exports = router;
