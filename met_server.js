var fs = require("fs")
,express = require('express')
,MongoClient = require('mongodb').MongoClient
,app = express();

// Connection URL
var url = 'mongodb://localhost:27017/ArtDB';

// Serve static files in public folder
app.use(express.static('public'));

/* Get all art from the database for a specific
 * year as requested by the client.
 */
app.get('/art/:year', function (req, res) {
  var year_requested = req.params['year'];
  get_art_by_year(year_requested, (err, data) => {
    if (err != null){
      console.log(err);
      res.json({"err": 1, "data": []});
    } else {
      res.json({"err" : 0, "data" : data});
    }
    return;
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/* Get all art from a specified year and pass
 * it to a callback. Does the actual mongo query.
 */
function get_art_by_year(year, cb){
  MongoClient.connect(url, function(err, db) {
    if(err !== null){
      cb(err);
    }
    db.collection("art").find({year}).toArray((err, res) => {
      console.log(res);
      cb(null, res);
    });
  });
}
