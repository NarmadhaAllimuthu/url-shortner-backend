const { MongoClient } = require("mongodb");
const express = require("express");
const router = express.Router();
const UrlModel = require("../models/urlShort"); // Import your Mongoose model

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
    try {
        const { longUrl } = req.body;
        const shortUrl = generateUrl();

        const newUrl = new UrlModel({
            longUrl,
            shortUrl,
        });

        const urlcreated = await newUrl.save();
        console.log(shortUrl)
        res.status(200).send("URL created");
    } catch (error) {
        console.log("Error :", error);
        res.status(400).json({ message: "Something went wrong!", errorMessage: error });
    }
});

router.get("/link", async (req, res) => {
    try {
       

        let urlShort = await UrlModel.find().toArray();
        console.log(urlShort);
     
        if (urlShort) {
            res.status(200).json(urlShort);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
