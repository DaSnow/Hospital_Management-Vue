var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const e = require('express');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/healthcare';

const client = new mongoClient(url, { useUnifiedTopology: true });
client.connect();

const database = client.db().collection('Users');

router.get('/', (req, res) => {
  database.find().toArray((error, result) => {
    if (error) {
      console.log("Failed to load Users");
      throw error;
    }
    res.json(result);
  });
});

router.get('/findAdmin', (req, res) => {
  database.find({ "Username": "Admin", "Password": "123", "Admin": "true" }).toArray((error, result) => {
    if (error) {
      console.log("Admin search failed");
      throw error;
    }
    let val = true;
    if (result.length > 0)
      val = false;
    res.json(val);
  });
});

router.post('/addAdmin', (req, res) => {
  let form = {
    Username: "Admin",
    Password: "123",
    Admin: "true"
  }
  database.insertOne(form, (error, result) => {
    if (error) {
      console.log("Failed to add Admin");
      throw error;
    }
    res.end();
  });
})

router.post('/add', (req, res) => {
  database.insertOne(req.body, (error, result) => {
    if (error) {
      console.log("Failed to insert User");
      throw error;
    }
    res.end();
  });
});

router.put('/update/:id', (req, res) => {
  let id = { _id: new mongodb.ObjectID(req.params.id) };
  let newVals = { $set: req.body }
  database.updateOne(id, newVals, (error, result) => {
    if (error) {
      console.log("Failed to update User");
      throw error;
    }
    res.end();
  });
});

router.delete('/delete/:id', (req, res) => {
  let id = { _id: new mongodb.ObjectID(req.params.id) };
  database.deleteOne(id, (error, result) => {
    if (error) {
      console.log("Failed to delete User");
      throw error;
    }
    res.end();
  });
});

module.exports = router;