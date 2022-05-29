var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const e = require('express');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/healthcare';

const client = new mongoClient(url, { useUnifiedTopology: true });
client.connect();

const database = client.db().collection('Appointments');

router.get('/', (req, res) => {
  database.find().toArray((error, result) => {
    if (error) {
      console.log("Failed to load Appointments");
      throw error;
    }
    res.json(result);
  });
});

router.post('/add', (req, res) => {
  database.insertOne(req.body, (error, result) => {
    if (error) {
      console.log("Failed to insert Appointment");
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
      console.log("Failed to update Appointment");
      throw error;
    }
    res.end();
  });
});

router.delete('/delete/:id', (req, res) => {
  let id = { _id: new mongodb.ObjectID(req.params.id) };
  database.deleteOne(id, (error, result) => {
    if (error) {
      console.log("Failed to delete Appointment");
      throw error;
    }
    res.end();
  });
});

module.exports = router;