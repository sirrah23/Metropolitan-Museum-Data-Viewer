'use strict';

const Writable = require('stream').Writable,
	util = require('util');

const CSVWriter = function(processFunc){
	Writable.call(this, {objectMode: true});
	this.processFunc = processFunc;
};
util.inherits(CSVWriter, Writable);

CSVWriter.prototype._write = function (chunk, enc, next) {
    this.processFunc(chunk.toString());
    next();
};

module.exports = CSVWriter;