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

module.exports = router;