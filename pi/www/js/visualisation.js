
var drops = [];
var persData;
var toneData;

var opennessRate;
var conscientiousnessRate;
var extraversionRate;
var agreeablenessRate;
var neuroticismRate;

var rateMultiplier = 10;


function preload(){
    var persUrl = 'https://api.mlab.com/api/1/databases/dat602/collections/Personality?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    var toneUrl = 'https://api.mlab.com/api/1/databases/dat602/collections/Tone?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    loadJSON(persUrl, persParse);
    loadJSON(toneUrl, toneParse);
}

function persParse(data){
    persData = data[data.length - 1];
    opennessRate = 60 + ((100 - persData.big5_openness) * rateMultiplier);
    conscientiousnessRate = 60 + ((100 - persData.big5_conscientiousness) * rateMultiplier);
    extraversionRate = 60 + ((100 - persData.big5_extraversion) * rateMultiplier);
    agreeablenessRate = 60 + ((100 - persData.big5_agreeableness) * rateMultiplier);
    neuroticismRate = 60 + ((100 - persData.big5_neuroticism) * rateMultiplier);

}

function toneParse(data){
    toneData = data[data.length - 1];

}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    
    

}

function draw() {
    background(255);
    for(var i = 0; i < drops.length; i++){
        drops[i].show();
        drops[i].grow(i);
        
    }

    if(frameCount % opennessRate == 0){
        var c = color(79, 146, 214, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % conscientiousnessRate == 0){
        var c = color(79, 214, 110, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % extraversionRate == 0){
        var c = color(198, 206, 86, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % agreeablenessRate == 0){
        var c = color(216, 60, 198, 255);
        drops.push(new Drop(c));
    }
    if(frameCount % neuroticismRate == 0){
        var c = color(232, 62, 0, 255);
        drops.push(new Drop(c));
    }

}

function mouseClicked(){
    drops.push(new Drop(color(0, 0, 0, 0)));
}



function Drop(color) {
    this.x = random(width);
    this.y = random(height);
    this.w = 10;
    this.alpha = 1;
    

    this.grow = function(index) {
        this.w += 10;
        this.alpha -= 0.01;
        
       
        
        if(this.alpha == 0){
            drops.splice(index, 1);
        }
    }

    this.show = function() {
        push();
        
        
        strokeWeight(2);
        color._array[3] = this.alpha;
        noFill();
        stroke(color);
        ellipse(this.x, this.y, this.w);
        pop();
    }
}