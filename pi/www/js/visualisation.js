//Create a Pixi Application
var app = new PIXI.Application({
    width: 480,
    height: 800,
    antialias: true
});


//Aliases
var Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    canvWidth = app.renderer.view.width,
    canvHeight = app.renderer.view.height;

//variables to hold personality scores
var opennessScore,
    conscientiousnessScore,
    extraversionScore,
    agreeablenessScore,
    neuroticismScore;

//arrays to hold objects
var clouds = [];


//Container to hold all sprites
var spriteContainer = new PIXI.Container();

//Add the canvas to the HTML document
document.body.appendChild(app.view);

//make the canvas sky coloured.
app.renderer.backgroundColor = 0xABEBFF;


//cloud variables
var cloudSpeed, cloudNum;

//container to hold clouds
var cloudContainer = new PIXI.Container();

//Load images
loader
    .add("groundTex", "assets/ground.png")
    .add("rainbowTex", "assets/rainbow.png")
    .add("sunTex", "assets/sun.png")
    .add("cloudTex", "assets/cloud.png")
    .add("persJSON", "https://api.mlab.com/api/1/databases/dat602/collections/Personality?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i")
    .load(setup);

function setup(){
    
    //parse the personality JSON data that's loaded in
    parsePersonality(loader.resources.persJSON.data);
    
    //create a container to hold the sprites
    app.stage.addChild(spriteContainer);
    
    //CREATE GROUND
    //create a sprite from the ground image
    //let groundSprite = new Sprite(
    //    loader.resources.groundTex.texture
    //   );
    
    //position the sprite 
    //groundSprite.anchor.set(0.5, 0.5);
    //groundSprite.position.set(canvWidth/2, canvHeight);
    //groundSprite.scale.set(0.5, 0.5);
    //groundSprite.zIndex = 10;
    
    //add the ground to the stage
    //spriteContainer.addChild(groundSprite);
    
    
    //create the rainbow
    //const rainbowSprite = createRainbow(spriteContainer);
    
    //create the sun
    //const sunSprite = createSun(spriteContainer);
    
    //function to get a number of clouds based on openness score.
    setupCloudVariables();
    
    //add cloud container to sprite container
    spriteContainer.addChild(cloudContainer);
    
    //create the first clouds
    for(var i = 0; i < (cloudNum / 2); i++){
    clouds.push(new Cloud(cloudContainer, true));
    }


    
    //start the gameloop
    drawLoop();
    
}

function drawLoop(){
    requestAnimationFrame(drawLoop);
    for(var i = 0; i < clouds.length; i++){
        clouds[i].move(i);
    }
    
    if(clouds.length < cloudNum){
        clouds.push(new Cloud(cloudContainer, false));
    }
        
}

function parsePersonality(data){
    parsedData = JSON.parse(data);
    lastEntry = parsedData[parsedData.length - 1];
    opennessScore = lastEntry.big5_openness;
    conscientiousnessScore = lastEntry.big5_conscientiousness;
    extraversionScore = lastEntry.big5_extraversion;
    agreeablenessScore = lastEntry.big5_agreeableness;
    neuroticismScore = lastEntry.big5_neuroticism;
}

function setupCloudVariables(){
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


function createRainbow(parent)
{
    
    //create rainbow sprite
    let rainbowSprite = new Sprite(
    loader.resources.rainbowTex.texture
    );
    //position and scale sprite
    rainbowSprite.anchor.set(0.5);
    rainbowSprite.rotation = -1.2;
    rainbowSprite.position.set(canvWidth*0.55, canvHeight* 0.75);
    rainbowSprite.scale.set(0.35);
    
    //set alpha of rainbow to match extraversion score
    //any score below 50 gives a alpha of 0, 50 - 100 scales from 0 to 1 alpha
    rainbowSprite.alpha = (extraversionScore - 50) / 50;
    
    //add to stage
    parent.addChild(rainbowSprite);
    parent.setChildIndex(rainbowSprite, 0);
    
    return rainbowSprite;
    
}


function createSun(parent){
    //create sun sprite
    let sunSprite = new Sprite(
    loader.resources.sunTex.texture
    );
    //position and scale sprite
    sunSprite.anchor.set(0.5);
    sunSprite.rotation = -1.2;
    sunSprite.position.set(canvWidth, 0);
    
    
    //scale the sun using agreeablenessScore
    //max of 0.45, min of 0.1
    let sunScale;
    if(agreeablenessScore < 30){
        sunScale = 0
        app.renderer.backgroundColor = 0x889EA3;
    } else {
        normalizedAgree = (agreeablenessScore - 30) / 70;
        sunScale = 0.1 + (0.35 * normalizedAgree);
        
    }
    sunSprite.scale.set(sunScale);

    
    //add to stage
    parent.addChild(sunSprite);
    parent.setChildIndex(sunSprite, 0);
    
    return sunSprite;
    
}
function Cloud(parent, first){
    
    this.speed = 0.2;
    this.speedMod = getRandomFloat(0, 0.3);
    
    
    //if first clouds then spawn on screen
    if(first){
    this.xLoc = getRandomInt(0, canvWidth);
    } else {
        this.xLoc = (0 - canvWidth * 0.75) + getRandomInt(0, canvWidth * 0.25);
    }
    
    //get random y value in top quarter of canvas
    this.yLoc = getRandomInt(canvHeight * 0.1, canvHeight * 0.35);
    
    //create cloud sprite
    let cloudSprite = new Sprite(
    loader.resources.cloudTex.texture
    );
    
    //position and scale sprite
    cloudSprite.position.set(this.xLoc, this.yLoc);
    cloudSprite.anchor.set(0.5);
    cloudSprite.scale.set(getRandomFloat(0.3, 0.5));
    cloudSprite.alpha = 1;

    
    this.move = function(index ) {
        cloudSprite.position.x += this.speed + this.speedMod;
        
        //if the cloud is fully off the screen delete it
        if(cloudSprite.position.x - (cloudSprite.width /2) > canvWidth){
            clouds.splice(index, 1);
        }
    }
    

    
    //add to stage
    parent.addChild(cloudSprite);
    //parent.setChildIndex(cloudSprite, 0);
    
}