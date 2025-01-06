const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
let userRoutes = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config({path:"./config.env"})
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

// #1 retrieve all - http://localhost:3000/users
userRoutes.route("/users").get(async (req, res) => {
  let db = database.getDb();
  try {
    let data = await db.collection("users").find({}).toArray();
    if (data && data.length > 0) {
      res.json(data);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// #2 retrieve one - http://localhost:3000/users/12345
userRoutes.route("/users/:id").get(async (req, res) => {
  let db = database.getDb();
  try {
    let data = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// #3 create one
userRoutes.route("/users").post(async (req, res) => {
  let db = database.getDb();

  const takenEmail = await db
    .collection("users")
    .findOne({ email: req.body.email }); //for only one email/taken email
  if (takenEmail) {
    res.json({ message: "The email is taken" });
    alert("email is already taken");
  } else {
    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    try {
      let mongoObject = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        joinDate: new Date(), // for new user
        posts: [], // no posts at all
      };
      let data = await db.collection("users").insertOne(mongoObject);
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// #4 update one
userRoutes.route("/users/:id").put(async (req, res) => {
  let db = database.getDb();
  try {
    let mongoObject = {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        joinDate: req.body.joinDate,
        posts: req.body.posts,
      },
    };
    let data = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// #5 delete one
userRoutes.route("/users/:id").delete(async (req, res) => {
  let db = database.getDb();
  try {
    let data = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (data.deletedCount > 0) {
      res.json({ message: "Post deleted" });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// #6 login
userRoutes.route("/users/login").post(async (req, res) => {

  let db = database.getDb();
  const user = await db.collection("users").findOne({ email: req.body.email });

  if (user) {
    let confirmation = await bcrypt.compare(req.body.password, user.password);

    if (confirmation) {
      const token = jwt.sign(user, process.env.SECRETKEY, {expiresIn:"1h"})
      res.json({ success: true, token });
      
    } else {
      res.json({ success: false, message: "wrong pass bro" });
    }
  } else {
    res.json({ success: false, message: "wrong email " });
  }
});


module.exports = userRoutes;
