const express = require("express");
const database = require("./connect");
const { ObjectId } = require("mongodb");
let postRoutes = express.Router();
require("dotenv").config()
const jwt = require('jsonwebtoken')

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
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
        res.status(500).json({ message: "Internal Server Error" });
    }
});

postRoutes.route("/posts").post(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        const author = req.body.user?.name || req.body.user?.email || req.body.author || "Anonymous";
        
        let mongoObject = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: author,
            dateCreated: req.body.dateCreated || new Date()
        };
        let data = await db.collection("posts").insertOne(mongoObject);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

postRoutes.route("/posts/:id").put(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        const post = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const currentUser = req.body.user?.email || req.body.user?.name;
        const postAuthor = post.author;
        
        if (postAuthor !== currentUser && 
            postAuthor?.toLowerCase() !== currentUser?.toLowerCase()) {
            return res.status(403).json({ message: "You can only edit your own posts" });
        }

        let mongoObject = {
            $set: { 
                title: req.body.title,
                description: req.body.description,
                content: req.body.content
            }
        };
        let data = await db.collection("posts").updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

postRoutes.route("/posts/:id").delete(verifyToken, async (req, res) => {
    let db = database.getDb();
    try {
        const post = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const currentUser = req.body.user?.email || req.body.user?.name;
        const postAuthor = post.author;
        
        if (postAuthor !== currentUser && 
            postAuthor?.toLowerCase() !== currentUser?.toLowerCase()) {
            return res.status(403).json({ message: "You can only delete your own posts" });
        }

        let data = await db.collection("posts").deleteOne({ _id: new ObjectId(req.params.id) });
        if (data.deletedCount > 0) {
            res.json({ message: "Post deleted successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
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
