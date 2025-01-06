const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
let postRoutes = express.Router();
require("dotenv").config({path:"./config.env"})
const jwt = require('jsonwebtoken')




// #1 retrieve all - http://localhost:3000/posts
postRoutes.route("/posts").get(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        let data = await db.collection("posts").find({}).toArray();
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

// #2 retrieve one - http://localhost:3000/posts/12345
postRoutes.route("/posts/:id").get(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        let data = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
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
postRoutes.route("/posts").post(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        let mongoObject = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: req.body.author,
            dateCreated: req.body.dateCreated
        };
        let data = await db.collection("posts").insertOne(mongoObject);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// #4 update one
postRoutes.route("/posts/:id").put(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        let mongoObject = {
            $set: { 
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                author: req.body.author,
                dateCreated: req.body.dateCreated
            }
        };
        let data = await db.collection("posts").updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// #6 delete one
postRoutes.route("/posts/:id").delete(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        let data = await db.collection("posts").deleteOne({ _id: new ObjectId(req.params.id) });
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

function verifyToken(request, response, next) {
    const authHeaders = request.headers["authorization"]
    const token = authHeaders && authHeaders.split(' ')[1]
    if (!token) {
        return response.status(401).json({message: "Authentication token is missing"})
    }

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return response.status(403).json({message: "Invalid Token"})
        }

        request.body.user = user
        next()
    })
}

module.exports = postRoutes;
