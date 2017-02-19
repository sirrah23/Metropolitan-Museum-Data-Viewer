var MongoClient = require('mongodb').MongoClient
, assert = require('assert')
,fs = require("fs")
,readline = require('readline')
,process = require('process');

// Connection URL
var url = 'mongodb://localhost:27017/ArtDB';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  db.createCollection("art");
  assert.equal(null, err);
  load_data(db);
});

//TODO: Deal with century time format e.g. "Early 15th-century..."
//TODO: Deal with specific times "02/13/2017 at 8:00:13 AM"
function load_data(db){
  var readableStream = fs.createReadStream(process.argv[2]);
  var rl = readline.createInterface({"input" : readableStream});
  var parsed = 0;
  var inserted = 0;
  rl.on('line', function(line){
    //console.log(++parsed);
    ++parsed;
    var csv_data = csv_split_line(line);
    var art_title = csv_data[6];
    var art_year = csv_data[22];
    if (art_year !== undefined){
      var re = /(\d{4})/;
      var year_match = csv_data[22].match(re);
      if(year_match !== null){
        db.collection('art').insertOne({title: art_title, year: year_match[0]}, function(err, r){
          ++inserted;
        });
      }
    }
  });
  rl.on('close', function(){
    console.log("Done! Inserted " + inserted + "/" + parsed);
    db.close();
  });
}

function csv_split_line(line){
  var quoted = false;
  var curr = "";
  var cols = [];
  for(var i = 0; i < line.length; i++){
    c = line.charAt(i);
    if ( c === '"' && !quoted){
      quoted = true;
    } else if ( c === '"' && quoted){
      quoted = false;
      cols.push(curr);
      curr = "";
    } else if (c === "," && !quoted) {
      cols.push(curr);
      curr = "";
    } else {
      curr += c;
    }
  }
  return cols;
};
