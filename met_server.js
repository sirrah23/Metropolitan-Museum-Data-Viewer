var fs = require("fs");
var readline = require('readline');
var express = require('express');
var app = express();


var readableStream = fs.createReadStream("/home/harris/Downloads/MetObjects.csv");
var rl = readline.createInterface({"input" : readableStream});
var artwork = {};

rl.on('line', function(line){
  var csv_data = line.split(",");
  if (csv_data[22] !== undefined){
    var re = /\d{4}/;
    var year_match = csv_data[22].match(re);
    if(year_match !== null && year_match[0]){
      if (year_match[0] in artwork){
        artwork[year_match[0]] += csv_data[6];
      } else {
        artwork[year_match[0]] = [csv_data[6]];
      }
      console.log(artwork);
    }
  }
});

app.get('/art/:year', function (req, res) {
  var year_requested = req.params['year'];
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

