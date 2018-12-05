//variables to hold personality scores
var opennessScore,
    conscientiousnessScore,
    extraversionScore,
    agreeablenessScore,
    neuroticismScore;

//arrays to hold objects
var sprites= [];
var clouds = [];

var bgColor;
var canvHeight;
var canvWidth;

//cloud variables
var cloudSpeed, cloudNum, cloudImg;

//active flower variables
var activeFlower, flowerComplete;

//flower sprites
var flower0, flower1, flower2, flower3, flower4
var illFlower1, illFlower2, illFlower3

//bool to control array sorting
var spritesSorted;

var spriteCount = 0;



function preload(){
    
    canvWidth = 480;
    canvHeight = 800;

    //API URL
    var persUrl = 'https://api.mlab.com/api/1/databases/dat602/collections/Personality?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    var activeFlowerUrl ='https://api.mlab.com/api/1/databases/dat602/collections/ActiveFlower?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i';
    
    flower0 = loadImage('assets/flower0.png');
    flower1 = loadImage('assets/flower1.png');
    illFlower1 = loadImage('assets/illflower1.png');
    flower2 = loadImage('assets/flower2.png');
    illFlower2 = loadImage('assets/illflower2.png');
    flower3 = loadImage('assets/flower3.png');
    illFlower3 = loadImage('assets/illflower3.png');
    flower4 = loadImage('assets/flower4.png');
    
    //load the data from mLabs
    loadJSON(persUrl, persParse);
    loadJSON(activeFlowerUrl, setupActiveFlower);
   
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
    
    
    loadImage('assets/sun.png', function(img) {
        let xLoc = canvWidth;
        let yLoc = 0;
        let sunScale = 0;
        if(agreeablenessScore < 30 ){
            sunScale = 0.0001;
            bgColor = ('#889EA3');
        } else {
            normalizedAgree = (agreeablenessScore - 30) / 70;
            sunScale = 0.4 + (0.4 * normalizedAgree);
            bgColor = color('#67D8FF');
        }

        let zIndex = 3;
        
        sprites.push(new Sprite(img, xLoc, yLoc, sunScale, 255, 0, zIndex));
    });
    
    loadImage('assets/rainbow.png', function(img) {
        let xLoc = canvWidth * 0.7;
        let yLoc = canvHeight * 0.7;
        let rot = -1;
        let alpha = ((extraversionScore - 50) / 50) * 255;
        let zIndex = 2;
        sprites.push(new Sprite(img, xLoc, yLoc, 1, alpha, rot, zIndex));
    });
    
    //load ground image and add to sprites array
    loadImage('assets/ground.png', function(img) {
        let xLoc = canvWidth/2;
        let yLoc = canvHeight * 0.85;
        let zIndex = 1;
        sprites.push(new Sprite(img, xLoc, yLoc, 1, 255, 0, zIndex));
    });
    
    loadImage('assets/cloud.png', function(img){
        let alpha = 220;
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

function setupActiveFlower(data){
    if(data.length == 0){
        
    } else {
        let petals = data[0].petals;
        let currentScore = data[0].currentFlowerScore;
        let oldScore = data[0].oldFlowerScore;
        activeFlower = new Flower(color, petals, currentScore, oldScore, true);
        if(data[0].currentFlowerScore >= 100){
            flowerComplete = true;
        }
    }
}


function setup() {
    
    
    createCanvas(canvWidth, canvHeight);
    spritesSorted = false;

    
    
  
}



function draw() {
    
    //sort array by zIndex while array is unsorted
    if(!spritesSorted) {
        sprites.sort(spriteSort);
        spritesSorted = true;
        
    }
    

    background(bgColor);
    
    for(var i = 0; i < sprites.length; i++){
        sprites[i].show();
    }
    
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
    
    activeFlower.sprite.show();
    
    if(clouds.length < cloudNum){
        clouds.push(new Cloud(cloudImg, 220, false));
    }
    
    if(flowerComplete){
        push();
        fill(255);
        textSize(30);
        textAlign(CENTER);
        text('flower complete', canvWidth/2, canvHeight - 10);
        pop();
    }
    
}

function mouseClicked(){
    if(flowerComplete){
        activeFlower = new Flower(0, 0, 0, 0, true);
        flowerComplete = false;
    }
}

function Sprite(img, x, y, scale, a, rot, zIndex){
    this.img = img;
    this.x = x;
    this.y = y;
    this.scale = scale;
    this.alpha = a;
    this.rot = rot;
    this.z = zIndex;
    
    
    this.show = function(){
        push();
        imageMode(CENTER);
        translate(this.x, this.y);
        tint(255, this.alpha);
        rotate(this.rot);
        image(img, 0, 0, this.img.width * this.scale, this.img.height * this.scale);
        pop();
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

function spriteSort(a, b){
    return b.z - a.z;
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



