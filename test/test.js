'use strict';

const assert = require('assert');
const Loader = require('../loader.js');

describe('loader',function(){
  let year_loader = new Loader();
  describe('getYear', function(){
    it('should parse a year properly', function(){
      assert.equal(year_loader.getYear("1823"), 1823);
    });
    it('should parse a "ca." year properly', function(){
      assert.equal(year_loader.getYear("ca. 1932"), 1932);
    });
    it('should get the first year in hyphenated range', function(){
      assert.equal(year_loader.getYear("1873-1920"), 1873);
    });
    it('should get year in after string', function(){
      assert.equal(year_loader.getYear("after 766 c.e."), 766);
    });
    it('should get year in hyphen range with second year lacking century', function(){
      assert.equal(year_loader.getYear("1209-32"), 1209);
    });
    it('should get year out of single century, converted appropriately', function(){
      assert.equal(year_loader.getYear("5th century"), 400);
    });
    it('should get year out of double century, converted appropriately', function(){
      assert.equal(year_loader.getYear("15th century"), 1400);
    });
    it('should return -1 for a non-year value', function(){
      assert.equal(year_loader.getYear("This is not a year!"), -1);
    });
  });
});
