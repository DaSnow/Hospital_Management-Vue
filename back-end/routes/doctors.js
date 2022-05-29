var express = require('express');
var router = express.Router();
const mongodb = require('mongodb');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/healthcare';

const client = new mongoClient(url, { useUnifiedTopology: true });
client.connect();

const database = client.db().collection('Doctors');

router.get('/', (req, res) => {
  database.find().toArray((error, result) => {
    if (error) {
      console.log("Failed to load Doctors");
      throw error;
    }
    res.json(result);
  });
});

router.post('/add', (req, res) => {
  database.insertOne(req.body, (error, result) => {
    if (error) {
      console.log("Failed to insert Doctor");
      throw error;
    }
    res.end();
  });
});

router.put('/update/:id', (req, res) => {
  let id = {_id: new mongodb.ObjectID(req.params.id)};
  let newVals = {$set: req.body}
  database.updateOne(id, newVals, (error, result) => {
    if (error) {
      console.log("Failed to update Doctor");
      throw error;
    }
    res.end();
  });
});

router.delete('/delete/:id', (req, res) => {
  let id = {_id: new mongodb.ObjectID(req.params.id)};
  database.deleteOne(id, (error, result) => {
    if (error) {
      console.log("Failed to delete Doctor");
      throw error;
    }
    res.end();
  });
});

module.exports = router;