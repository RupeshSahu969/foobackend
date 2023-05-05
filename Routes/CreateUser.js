const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret="MyNameISEnd"

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const salt=await bcrypt.genSalt(10);
    let setPassword=await bcrypt.hash(req.body.password,salt)
    

    try {
      User.create({
        name: req.body.name,
        password: setPassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.send({ sucess: true });
    } catch (err) {
      console.log(err);
      res.send({ sucess: false });
    }
  }
);

router.post("/loginuser",
[
    body("email").isEmail(),
    body("password", "Incorrect Password").isLength({ min: 5 }),
  ]
, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


  let email = req.body.email;
  try {
    let userData = await User.findOne({email});
    if (!userData) {
      return res
        .status(400)
        .json({ errors: "Try logging with correct credentials" });
    }
    const pwdCompare=await bcrypt.compare(req.body.password,userData.password)

    if (!pwdCompare) {
      return res
        .status(400)
        .json({ errors: "Try logging with correct credentials" });
    }
    const data={
      user:{
        id:userData.id
      }
    }

    const authToken=jwt.sign(data,jwtSecret)

    return res.send({ sucess: true,authToken:authToken});
  } catch (err) {
    console.log(err);
    res.send({ sucess: false });
  }
});

module.exports = router;
