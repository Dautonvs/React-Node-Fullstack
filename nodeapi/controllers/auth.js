const jwt = require("jsonwebtoken");
require('dotenv').config();
const expressJwt = require('express-jwt');
const User = require("../models/user");

exports.signup = async (req, res) => {
    const userExists = await User.findOne({email: req.body.email})
    if(userExists) return res.status(403).json({
      error: "Email is taken!"
    });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({message: "The user saved successfull, now you can login"});
};

exports.signin = (req, res) => {
  //find the user based on Email
  const {email, password} = req.body;
  User.findOne({ email }, (err, user) => {
    if(err || !user){
      return res.status(401).json({
        error: "User with that email doesn't exist. Please signin."
      });
    }

    //if user is found make sure that email and password match
    //create authenticate method in model and use here
    if(!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

  //generate token using user ID and the JWT_SECRET
  const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

  //persist the token as 't' in cookies with expity date
  res.cookie("t", token, {expire: new Date() + 9999});

  //return response with user and token to FrontEnd client
  const {_id, name, email} = user;
  return res.json({token, user: {_id, email, name}});
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t")
  return res.json({message: "Signout successfull!"});
};

exports.requireSignin = expressJwt({
  // if token is valid, express jwt appends the veridied users id in an auth key
  //to the request object
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});
