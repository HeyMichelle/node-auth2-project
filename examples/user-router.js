const express = require("express");
const userModel = require("../models/user-model");
const userMiddleware = require("../middleware/user-middleware");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.get("/users", userMiddleware.restrict(), async (req, res, next) => {
  try {
    res.json(await userModel.find());
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findBy({ username }).first();

    if (user) {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    const newUser = await userModel.add({
      username,
      // has with time complexity of 10
      password: await bcrypt.hash(password, 14),
      // instead of putting directly, give hash value by import bcrypt js (step 1)
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findBy({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    // check that the password is valid here
    // compares plain text pw from req body to the hash stored in the db, returns true/false
    const passwordValid = await bcrypt.compare(password, user.password);

    // check if has of req body pw matches the hash we already have stored in db
    if (!passwordValid) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    // step 9: creates a new session for the user and sends it as a cookie
    req.session.user = user;

    res.json({
      message: `Welcome ${user.username}!`,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/logout", userMiddleware.restrict(), async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(204).end();
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
