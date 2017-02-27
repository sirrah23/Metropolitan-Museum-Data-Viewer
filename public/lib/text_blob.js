function TextBlob(x, y, text_value, link){
  this.x = x;
  this.y = y;
  this.text_value = text_value;
  this.link = link;
}

TextBlob.prototype.show = function(){
  text(this.text_value, this.x, this.y);
}