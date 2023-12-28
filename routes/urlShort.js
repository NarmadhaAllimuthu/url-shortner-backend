const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const router = express.Router();
const URL = process.env.mongodb_url;

function generateUrl() {
    var rndResult = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var characterLength = characters.length;

    for (var i = 0; i < 5; i++) {
        rndResult += characters.charAt(
            Math.floor(Math.random() * characterLength)
        )

    }
    console.log(rndResult)
    return rndResult;
}


router.post("/create-link", async (req, res) => {

    console.log(req.body);
    //create short url

    // console.log(generateUrl())

    //store in DB
    try {
        const connection = await MongoClient.connect(URL);
        const db = connection.db("URL-Shortner-DB");

        const urlShort = await db.collection("create-url").insertOne({
            longUrl: req.body.longUrl,
            shortUrl: generateUrl()


        });
        await connection.close();
        res.status(200).send("url created")
    } catch (error) {
        console.log("Error :", error);
        res.status(400).json({ message: "Something went wrong !" });

    }

})


router.get("/link", async (req, res) => {
    try {
        const connection = await MongoClient.connect(URL);
        const db = connection.db("URL-Shortner-DB");

        let urlShort = await db.collection("create-url").find().toArray();
        console.log(urlShort);
        await connection.close();
        if (urlShort) {
            // console.log(urlShort.longUrl)

            res.status(200).json(urlShort);

        }
    } catch (error) {
        console.log(error);
    }
})


module.exports = router;


