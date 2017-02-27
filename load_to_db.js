'use strict';

const MongoClient = require('mongodb').MongoClient
, assert = require('assert')
,fs = require("fs")
,process = require('process')
,Loader = require('./loader.js');


// Connection URL
const url = 'mongodb://localhost:27017/ArtDB';
const file_name = process.argv[2];

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  db.createCollection("art");
  assert.equal(null, err);
  const loader = new Loader(db, file_name);
  loader.load_data();
});

