'use strict';

const fs = require('fs')
,readline = require('readline')
,assert = require('assert')
,CSVReader = require('./csv_reader.js')
,CSVWriter = require('./csv_writer.js');

function loader(db, input_file){
  this.db = db;
  this.input_file = input_file;
};

loader.prototype.csv_split_line = function(line){
  let quoted = false;
  let curr = "";
  let cols = [];
  for(var i = 0; i < line.length; i++){
    var c = line.charAt(i);
    if ( c === '\"'){
      quoted = !quoted;
    } else if ((c === "," || c === "\n") && !quoted) {
      cols.push(curr);
      curr = "";
    } else {
      curr += c;
    }
  }
  if(curr.length > 0){
    cols.push(curr);
  }
  return cols;
};

loader.prototype.read_line = function(line){
  const csv_data = this.csv_split_line(line);
  const art_title = csv_data[6];
  const art_year = csv_data[22];
  if (art_year !== undefined){
    const year_match = this.getYear(art_year);
    if(year_match !== -1){
      this.db.collection('art').insertOne({title: art_title, year: year_match}, function(err, r){
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

loader.prototype.load_data = function(){
  const readableStream = this.genReadStream();
  const csvReader = new CSVReader();
  const csvWriter = new CSVWriter(this.read_line.bind(this));
  const done_cb = function(){
    console.log("Done!");
    this.db.close();
  }.bind(this);
  readableStream.pipe(csvReader).pipe(csvWriter);
  csvReader.on('end', function(){
    csvWriter.end();
  });
  csvWriter.on('finish', function(){
    done_cb();
  });
};

module.exports = loader;
