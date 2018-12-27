//variables to hold personality scores
var opennessScore,
    conscientiousnessScore,
    extraversionScore,
    agreeablenessScore,
    neuroticismScore;

var clouds = [];

var bgColor;
var canvHeight;
var canvWidth;

//cloud variables
var cloudSpeed, cloudNum, cloudImg;

//active flower variables

//flower sprites

//bool to control array sorting




function preload(){
    
    canvWidth = 480;
    canvHeight = 800;

    //API URL
    var persUrl = 'https://api.mlab.com/api/1/databases/dat602/collections/Personality?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    

    
    //load the data from mLabs
    loadJSON(persUrl, persParse);

   
}


function persParse(data){
    
    //get the last entry
    lastEntry = data[data.length - 1];
    
    //store scores
    opennessScore = lastEntry.big5_openness;
    conscientiousnessScore = lastEntry.big5_conscientiousness;
    extraversionScore = lastEntry.big5_extraversion;
    agreeablenessScore = lastEntry.big5_agreeableness;
    neuroticismScore = lastEntry.big5_neuroticism;
    
    loadImage('assets/cloud.png', function(img){
        let alpha = 150;
        cloudImg = img;
        if(opennessScore == 100){
            cloudNum = 0;
        } else if (opennessScore >= 80){
            cloudNum = 2;
        } else if (opennessScore >= 60){
            cloudNum = 4;
        } else if (opennessScore >= 40){
            cloudNum = 6;
        } else if (opennessScore >= 20){
            cloudNum = 8;
        } else if (opennessScore < 20){
            cloudNum = 10;
        }
        for(let i = 0; i < cloudNum / 2; i++){
            clouds.push(new Cloud(img, alpha, true));
        }
    });
 }



function setup() {
    
    
    createCanvas(canvWidth, canvHeight);

    bgColor = color(100, 100, 255);
    
  
}



function draw() {
    

    background(bgColor);
    
    
    for(var i = 0; i < clouds.length; i++){
        let cloud = clouds[i];
        if(cloud.x - ((cloud.img.width * cloud.scale) /2) > canvWidth){
            clouds.splice(i, 1);
            i--;
        } else {
            cloud.move();
            cloud.show();
        }
    }
    
    
    if(clouds.length < cloudNum){
        clouds.push(new Cloud(cloudImg, 150, false));
    }
    
}





function Cloud(img, a, first){
    this.img = img;
    this.scale = getRandomFloat(0.8, 1);
    this.alpha = a;
    
    this.speed = getRandomFloat(0.2, 1);
    
    if(first){
    this.x = getRandomInt(0, canvWidth);
    } else {
        this.x = (0 - canvWidth * 0.75) + getRandomInt(0, canvWidth * 0.25);
    }
    //get random y value in top quarter of canvas
    this.y = getRandomInt(canvHeight * 0.1, canvHeight * 0.35);
    
    this.show = function(){
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        tint (255, this.alpha);
        image(img, 0, 0, this.img.width * this.scale, this.img.height * this.scale);
        pop();
    }
    this.move = function(){
        this.x += this.speed;
    }
    
    
}

function getRandomFloat(min, max){
    let range = max - min;
    let x = range * Math.random();
    let value = x + min;
    return value;
}

function getRandomInt(min, max){
    max += 1;
    let range = max - min;
    let x = range * Math.random();
    let value = x + min;
    return Math.floor(value);
    
}



