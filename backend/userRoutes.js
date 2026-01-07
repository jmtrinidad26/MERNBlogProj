const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
let userRoutes = express.Router();
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 6;

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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRoutes.route("/users").post(async (req, res) => {
  let db = database.getDb();

  const takenEmail = await db
    .collection("users")
    .findOne({ email: req.body.email });
  if (takenEmail) {
    return res.status(409).json({ message: "The email is already taken" });
  } else {
    const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    try {
      let mongoObject = {
        name: req.body.name,
        email: req.body.email,
        password: hash,
        joinDate: new Date(),
        posts: [],
      };
      let data = await db.collection("users").insertOne(mongoObject);
      res.status(201).json({ message: "User created successfully", data });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRoutes.route("/users/login").post(async (req, res) => {

  let db = database.getDb();
  const user = await db.collection("users").findOne({ email: req.body.email });

  if (user) {
    let confirmation = await bcrypt.compare(req.body.password, user.password);

    if (confirmation) {
      const token = jwt.sign(user, process.env.SECRETKEY, {expiresIn:"1h"})
      res.json({ success: true, token });
      
    } else {
      res.status(401).json({ success: false, message: "Invalid password" });
    }
  } else {
    res.status(401).json({ success: false, message: "Invalid email" });
  }
});


module.exports = userRoutes;
