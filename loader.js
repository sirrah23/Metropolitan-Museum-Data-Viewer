'use strict';

const fs = require('fs')
,readline = require('readline')
,assert = require('assert');

function loader(db, input_file){
  this.db = db;
  this.input_file = input_file;
};

//TODO: Fix this
loader.prototype.csv_split_line = function(line){
  var quoted = false;
  var curr = "";
  var cols = [];
  for(var i = 0; i < line.length; i++){
    var c = line.charAt(i);
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

loader.prototype.read_line = function(line){
  var csv_data = this.csv_split_line(line);
  var art_title = csv_data[6];
  var art_year = csv_data[22];
  if (art_year !== undefined){
    var year_match = this.getYear(art_year);
    if(year_match !== -1){
      this.db.collection('art').insertOne({title: art_title, year: year_match[1]}, function(err, r){
      });
    }
  }
};

loader.prototype.genReadStream = function(){
  return fs.createReadStream(this.input_file);
};

loader.prototype.getYear = function(date_str){
  const century_re = /(\d+)th century/;
  const year_re = /(\d{1,4})/;
  let res;
  res = date_str.match(century_re);
  if (res !== null){
    return (Number(res[1])-1)*100; // Convert century to year
  }
  res = date_str.match(year_re);
  if (res !== null){
    return Number(res[1]);
  }
  return -1;
};

//TODO: Deal with century time format e.g. "Early 15th-century..."
//TODO: Deal with specific times "02/13/2017 at 8:00:13 AM"
loader.prototype.load_data = function(){
  var readableStream = this.genReadStream();
  //TODO: Create my own stream here (ignore quoted \n)
  var rl = readline.createInterface({"input" : readableStream});

  var line_cb = function(line){
    return this.read_line(line);
  }.bind(this);

  var done_cb = function(){
    console.log("Done!");
    this.db.close();
  }.bind(this);

  rl.on('line', line_cb);
  rl.on('close', done_cb);
};

module.exports = loader;

