'use strict';

const Transform = require('stream').Transform,
	util = require('util');

const CSVReader = function(){
	Transform.call(this, {objectMode: true});
	this.csv_line = '';
	this.quoted = false;
};

util.inherits(CSVReader, Transform);

CSVReader.prototype._transform = function(chunk, encoding, callback){
	let curr_str = chunk.toString();
	for(let i = 0; i < curr_str.length; i++){
		this.csv_line += curr_str.charAt(i);
		if(curr_str.charAt(i) == "\""){
			this.quoted = !this.quoted;
		}
		else if(curr_str.charAt(i) == '\n'){
			if(!this.quoted){
				this.push(this.csv_line);
				this.csv_line = '';
			}
		}
	}
	callback();
};

module.exports = CSVReader;