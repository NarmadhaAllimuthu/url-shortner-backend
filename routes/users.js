var express = require('express');
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
var router = express.Router();

const URL = process.env.mongodb_url;
 
  router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        // console.log(hashPassword);
        const connection = await MongoClient.connect(URL);
        const db = connection.db("URL-Shortner-DB");
        const checkUser = await db.collection("registering_user").find({ userFirstName: req.body.userFirstName }).toArray();
        const checkUser2 = await db.collection("registering_user").find({ userFirstName: req.body.userLastName }).toArray();

        if (checkUser.length > 0 || checkUser2.length > 0) {
            res.status(401).json({ message: "User already exists. Change data to register." });
        }

        else {
            req.body.password = hashPassword
            req.body.confirmPassword = hashPassword
            const user = await db.collection("registering_user").insertOne(req.body);
            //    console.log(req.body);
            res.json({ meassage: "Registered Successfully !" })
            await connection.close();

        }
    } catch (error) {
        console.log("Error", error);
        res.json({ message: "Something went wrong" });
    }

});


router.post("/login", async (req, res) => {
  try {
      const connection = await MongoClient.connect(URL);
      const db = connection.db("URL-Shortner-DB");

      const user = await db.collection("registering_user").findOne({ emailId: req.body.emailId.toLowerCase() });
      // console.log("User Data from Database:", user);
      if (user) {
          const passwordCheck = await bcrypt.compare(req.body.password, user.password);

          if (passwordCheck) {
              const token = jwt.sign({ email: user.emailId }, process.env.secret_key);
              // console.log(token);
              res.json({ message: "Login Successfully", token });
          } else {
              res.status(401).json({ message: "Invalid Password" });
          }
      } else {
          res.status(404).json({ message: "User not found" });
      }

      await connection.close();
  } catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: "Something went wrong" });
  }
});





module.exports = router;
