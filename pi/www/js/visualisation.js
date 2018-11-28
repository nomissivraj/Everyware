
var drops = [];
var persData;
var toneData;

var opennessRate;
var conscientiousnessRate;
var extraversionRate;
var agreeablenessRate;
var neuroticismRate;

var rateMultiplier = 5;

var outlineColour;
var bgColour;



function preload(){
    var persUrl = 'https://api.mlab.com/api/1/databases/dat602/collections/Personality?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    var toneUrl = 'https://api.mlab.com/api/1/databases/dat602/collections/Tone?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    loadJSON(persUrl, persParse);
    loadJSON(toneUrl, toneParse);
}

function persParse(data){
    persData = data[data.length - 1];
    opennessRate = 30 + ((100 - persData.big5_openness) * rateMultiplier);
    conscientiousnessRate = 30 + ((100 - persData.big5_conscientiousness) * rateMultiplier);
    extraversionRate = 30 + ((100 - persData.big5_extraversion) * rateMultiplier);
    agreeablenessRate = 30 + ((100 - persData.big5_agreeableness) * rateMultiplier);
    neuroticismRate = 30  + ((100 - persData.big5_neuroticism) * rateMultiplier);

}

function toneParse(data){
    toneData = data[data.length - 1];
    delete toneData.timestamp;
    
    console.log(toneData);
    var highest = Object.keys(toneData).reduce(function(a, b){ return toneData[a] > toneData[b] ? a : b });
    
    if(highest == "fear"){
        bgColour = color(107, 96, 84);
    } 
    else if(highest == "anger"){
        bgColour = color(211, 78, 36);
    }
    else if(highest == "joy"){
        bgColour = color(255, 238, 147);
    }
    else if(highest == "sadness"){
        bgColour = color(35, 57, 91);
    }
    else if(highest == "analytical"){
        bgColour = color(170, 171, 188);
    }
    else if(highest == "confident"){
        bgColour = color(74, 49, 77);
    }
    else if(highest == "tentative"){
        bgColour = color(194, 239, 235);
    } 
    else {
        bgColour = color(255);
    }
    

}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    outlineColour = color(255, 255, 255, 255);
    

}

function draw() {
    background(bgColour); 
    for(var i = 0; i < drops.length; i++){
        drops[i].grow(i);
        drops[i].show(i);

        
    }

    if(frameCount % opennessRate == 0){
        var c = color(154, 196, 248, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % conscientiousnessRate == 0){
        var c = color(255, 253, 130, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % extraversionRate == 0){
        var c = color(250, 131, 52, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % agreeablenessRate == 0){
        var c = color(207, 255, 179, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % neuroticismRate == 0){
        var c = color(221, 115, 115, 255);
        drops.push(new Drop(c));
    }
    
    

}



function Drop(color) {
    this.x = random(width);
    this.y = random(height);
    this.w = 10;
    this.alpha = 1;

    this.grow = function(index) {
        this.w += 10;
        this.alpha -= 0.01;
    }

    this.show = function(index) {
        push();
        
        
        strokeWeight(2);
        color._array[3] = this.alpha;
        outlineColour._array[3] = this.alpha;
        stroke(outlineColour);
        
        fill(color);
        ellipse(this.x, this.y, this.w);
        pop();
        if(this.w >= width * 3){
            drops.splice(index, 1);
        }
    }
}