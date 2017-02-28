var year_div, year_slider, prev_year, year_disp;
var display_limit = 25; // number of art works to display pick
var art_text = []; 

function setup(){
  createCanvas(window.innerWidth, 600);
  createElement("br");
  background(51);
  year_div = createElement("div");
  year_div.child(year_slider);
  year_slider = createSlider(1700, 2017, 1);
  year_disp = createElement("div");
}

function draw(){
  fill(255);
  //var pos = createVector(random(0, width), random(0,height));
  if(prev_year !== year_slider.value()){
    prev_year = year_slider.value();
    year_disp.remove();
    year_disp = createElement("p", "Year: " + year_slider.value());
    year_div.child(year_disp);
    httpGet("/art/"+year_slider.value(), null, "json", function(data){
      background(51);
      var art_works = shuffle(data.data);
      var bound = Math.min(display_limit, art_works.length);
      art_text = [];
      for(var i = 0; i < bound ; i++){ //TODO: Randomize
        var pos = createVector(random(0, width), random(0,height));
        var curr_text = new TextBlob(pos.x, pos.y, art_works[i].title, art_works[i].link);
        art_text.push(curr_text);
        curr_text.show();
      }
    });
  }
}

function mousePressed(){
  var d;
  for(var i =0; i < art_text.length; i++){
    d = dist(art_text[i].x, art_text[i].y, mouseX, mouseY)
    if(d < 50){
      window.open(art_text[i].link, "_blank");
      return;
    }
  }
}
