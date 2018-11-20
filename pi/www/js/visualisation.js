
var drops = [];
var persData;
var toneData;

var opennessRate;
var conscientiousnessRate;
var extraversionRate;
var agreeablenessRate;
var neuroticismRate;

var rateMultiplier = 10;

var outlineColour;



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
    
    //FEAR BLACK/ Dark greayrt
    //anger red fuck
    //joy yellow
    //sadness some kind of blue
    //anal light grey maybe
    // confident purp
    //tentative pale turquoise
    

}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    outlineColour = color(255, 255, 255, 255);
    

}

function draw() {
    background(200);
    for(var i = 0; i < drops.length; i++){
        drops[i].grow(i);
        drops[i].show();

        
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
        
       
        
        if(this.alpha < 0){
            drops.splice(index, 1);
        }
    }

    this.show = function() {
        push();
        
        
        strokeWeight(2);
        color._array[3] = this.alpha;
        outlineColour._array[3] = this.alpha;
        stroke(outlineColour);
        
        fill(color);
        ellipse(this.x, this.y, this.w);
        pop();
    }
}