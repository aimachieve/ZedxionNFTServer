const passport = require("passport");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.get("/steam",
  passport.authenticate("steam", { session: false }),

);

router.get(
  "/steam/return",
  passport.authenticate("steam", { session: false }),
  (req, res) => {
    console.log("/steam/return", req.user)
    const token = jwt.sign({ user: req.user }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    const user = JSON.stringify(req.user)
    res.render("authenticated", {
      jwtToken: token,
      user: user,
      clientUrl: process.env.FRONTEND_URL,
    });
  },
);

module.exports = router;
