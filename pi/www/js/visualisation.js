//Create a Pixi Application
var app = new PIXI.Application({
    width: 600,
    height: 1024,
    legacy: true,
    roundPixels: true
});


//Aliases
var Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache,
    canvWidth = app.renderer.view.width,
    canvHeight = app.renderer.view.height,
    text = PIXI.Text;

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

//Container to hold buttons
var btnContainer = new PIXI.Container();

//Add the canvas to the HTML document
document.body.appendChild(app.view);

//make the canvas sky coloured.
app.renderer.backgroundColor = 0xABEBFF;

//flower variables
var activeFlower, flowerComplete, petalColors, flowerPlanted, flowerSprite;

//text variables
var style, noFlowerText, flowerCompleteText;

//cloud variables
var cloudSpeed, cloudNum;

//container to hold clouds
var cloudContainer = new PIXI.Container();

//the garden panel to see previous flowers
var gardenPanelObj;

//Load images
loader
    .add("groundTex", "assets/ground.png")
    .add("rainbowTex", "assets/rainbow.png")
    .add("sunTex", "assets/sun.png")
    .add("cloudTex", "assets/cloud.png")
    .add("flower0", "assets/flower0.png")
    .add("flower1", "assets/flower1.png")
    .add("flower2", "assets/flower2.png")
    .add("flower3", "assets/flower3.png")
    .add("flower4", "assets/flower4.png")
    .add("illflower1", "assets/illflower1.png")
    .add("illflower2", "assets/illflower2.png")
    .add("illflower3", "assets/illflower3.png")
    .add('flowerCenter', "assets/flowercenter.png")
    .add('petals0', "assets/petals0.png")
    .add('petals1', "assets/petals1.png")
    .add('petals2', "assets/petals2.png")
    .add('petals3', "assets/petals3.png")
    .add('petals4', "assets/petals4.png")
    .add('petals5', "assets/petals5.png")
    .add('petals6', "assets/petals6.png")
    .add('petals7', "assets/petals7.png")
    .add('gardenBtn', "assets/gardenBtn.png")
    .add('closeBtn', 'assets/closeBtn.png')
    .add('leftBtn', 'assets/leftBtn.png')
    .add('rightBtn', 'assets/rightBtn.png')
    .add('gardenPanel', 'assets/gardenPanel.png')
    .add("persJSON", "https://api.mlab.com/api/1/databases/dat602/collections/Personality?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i")
    .add("activeFlowerJSON", "https://api.mlab.com/api/1/databases/dat602/collections/ActiveFlower?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i")
    .add('previousFlowersJSON', "https://api.mlab.com/api/1/databases/dat602/collections/Flowers?apiKey=zQ7SEYq_OxfzvDkJvF_DRW2HIPhPFv9i")
    .load(setup);

function setup(){
    
    
    //array of petal colors
    petalColors = [
        "0xff8200", //orange
        "0x15e1ff", //blue
        "0xff9098", //pink
        "0x9f67d2", //yellow
        "0xffff1e", //light purple
        "0xe10000", //red
        "0x1fe4c7", //teal
        "0x59038a" // dark purple
        
    ];
    
    //set up text styles
    style = new PIXI.TextStyle({
        align: 'center',
        fontFamily: 'Arial',
        fontSize: 26,
        fontWeight: 'bold',
        fill: '#ffffff', 
        stroke: '#000000',
        strokeThickness: 3,
        wordWrap: true,
        wordWrapWidth: 440
    });
    
    
    //parse the personality JSON data that's loaded in
    parsePersonality(loader.resources.persJSON.data);
    
    // setup the active flower data
    setupActiveFlower(loader.resources.activeFlowerJSON.data);
    
    //create a container to hold the sprites
    app.stage.addChild(spriteContainer);
    app.stage.addChild(btnContainer);
    
    //CREATE GROUND
    //create a sprite from the ground image
    let groundSprite = new Sprite(
        loader.resources.groundTex.texture
       );
    
    //position the sprite 
    groundSprite.anchor.set(0.5, 0.5);
    groundSprite.position.set(canvWidth * 0.5, canvHeight * 0.95);
    groundSprite.scale.set(0.9);
    
    
    //add the ground to the stage
    spriteContainer.addChild(groundSprite);
    spriteContainer.setChildIndex(groundSprite, 0);
    
    
    //create the rainbow
    const rainbowSprite = createRainbow(spriteContainer);
    
    //create the sun
    const sunSprite = createSun(spriteContainer);
    
    //function to get a number of clouds based on openness score.
    setupCloudVariables();
    
    //add cloud container to sprite container
    spriteContainer.addChild(cloudContainer);
    spriteContainer.setChildIndex(cloudContainer, 1);
    
    //create the first clouds
    for(var i = 0; i < (cloudNum / 2); i++){
    clouds.push(new Cloud(cloudContainer, true));
    }
    
    gardenPanelObj = new gardenPanel();
    
    createButtons(btnContainer);

    
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

function setupActiveFlower(data){
    activeFlowerJSON = JSON.parse(data);
    if(activeFlowerJSON.length == 0){
        flowerPlanted = false;
        noFlowerText = new text('No flower planted! Tap the screen to plant!', style);
        noFlowerText.anchor.set(0.5);
        noFlowerText.x = canvWidth / 2;
        noFlowerText.y = canvHeight * 0.95;
        spriteContainer.addChild(noFlowerText);
        
    } else {
        flowerPlanted = true;
        let color = activeFlowerJSON[0].color;
        let petals = activeFlowerJSON[0].petals;
        let currentScore = activeFlowerJSON[0].currentFlowerScore;
        if(currentScore >= 100){
            flowerComplete = true;
            flowerCompleteText = new text('Flower Complete! Tap to save and plant a new seed.', style);
                flowerCompleteText.anchor.set(0.5);
                flowerCompleteText.x = canvWidth / 2;
                flowerCompleteText.y = canvHeight * 0.95;
                spriteContainer.addChild(flowerCompleteText);
        }
        let oldScore = activeFlowerJSON[0].oldFlowerScore;
        activeFlower = new Flower(color, petals, currentScore, oldScore, true, spriteContainer);
    }
    
}

var canvas = document.getElementsByTagName("canvas")[0];
canvas.addEventListener("click", () => {
    if(flowerComplete || !flowerPlanted){
        createNewFlower();
    }
});



function createNewFlower(){
    let newFlower = {
        color: petalColors[getRandomInt(0, petalColors.length - 1)],
        petals: getRandomInt(0, 7),
        currentFlowerScore: 0,
        oldFlowerScore: 0
    }
    if(!flowerPlanted) spriteContainer.removeChild(noFlowerText);
    if(flowerComplete) {
        spriteContainer.removeChild(flowerCompleteText);
        spriteContainer.removeChild(flowerSprite);
    }
    //create temp seed planted flower
    activeFlower = new Flower(0, 0, 0, 0, true, spriteContainer);
    flowerPlanted = true;
    flowerComplete = false;
    socket.emit('newFlower', newFlower);
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
    rainbowSprite.rotation = -0.5;
    rainbowSprite.position.set(canvWidth*0.65, canvHeight* 0.75);
    rainbowSprite.scale.set(1);
    
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
        sunScale = 0.4 + (0.35 * normalizedAgree);
        
    }
    sunSprite.scale.set(sunScale);

    
    //add to stage
    parent.addChild(sunSprite);
    parent.setChildIndex(sunSprite, 0);
    
    return sunSprite;
    
}
function Cloud(parent, first){
    
    this.speed = 0.2 + getRandomFloat(0, 0.5);
    
    
    //if first clouds then spawn on screen
    if(first){
    this.xLoc = getRandomInt(0, canvWidth);
    } else {
        this.xLoc = (0 - canvWidth * 0.75) + getRandomInt(0, canvWidth * 0.25);
    }
    
    //get random y value in top quarter of canvas
    this.yLoc = getRandomInt(canvHeight * 0.1, canvHeight * 0.25);
    
    //create cloud sprite
    let cloudSprite = new Sprite(
    loader.resources.cloudTex.texture
    );
    
    //position and scale sprite
    cloudSprite.position.set(this.xLoc, this.yLoc);
    cloudSprite.anchor.set(0.5);
    cloudSprite.scale.set(getRandomFloat(0.5, 0.9));
    cloudSprite.alpha = 1;

    
    this.move = function(index ) {
        cloudSprite.position.x += this.speed;
        
        //if the cloud is fully off the screen delete it
        if(cloudSprite.position.x - (cloudSprite.width /2) > canvWidth){
            clouds.splice(index, 1);
        }
    }
    

    
    //add to stage
    parent.addChild(cloudSprite);
    //parent.setChildIndex(cloudSprite, 0);
    
}

function createButtons(parent){
    
    //create garden button
    let gardenBtnSprite = new Sprite(loader.resources.gardenBtn.texture);
    gardenBtnSprite.anchor.set(0.5);
    gardenBtnSprite.position.set(45, 45);
    gardenBtnSprite.interactive = true;
    gardenBtnSprite.on('pointerdown', function(e){
        gardenPanelObj.show();
    });
    parent.addChild(gardenBtnSprite);
    
    
    
}

function gardenPanel(){
    
    //create and position sprite off screen
    this.sprite = new Sprite(loader.resources.gardenPanel.texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(-1000, -1000);
    this.currentPage = 0;
    this.pageCount = 0;
    app.stage.addChild(this.sprite);
    
    //populate panel with flowers using info from database
    //console.log(JSON.parse(loader.resources.previousFlowersJSON.data));
    let flowerData = JSON.parse(loader.resources.previousFlowersJSON.data);
    let oldFlowerCont = new PIXI.Container();
    oldFlowerCont.x = -170; 
    oldFlowerCont.y = -250;
    this.sprite.addChild(oldFlowerCont);
    var timeStampStyle = new PIXI.TextStyle({
        align: 'center',
        fill:0xFFFFFF,
        fontWeight: 'bold',
        fontSize: 30,
        dropShadow: true,
        dropShadowAlpha: 0.5,
        dropShadowDistance: 3,
        wordWrap: true,
        wordWrapWidth: 200
    });
    
    var count = 0;
    var page = 0;
    for(var i = flowerData.length - 1; i >= 0; i--){
        if(count === 9){
            page++;
            this.pageCount++;
            count = 0;
        }
        let petalString = "petals" + flowerData[i].petals;
        let flower = new Sprite(loader.resources[petalString].texture);
        flower.anchor.set(0.5);
        flower.tint = flowerData[i].color;
        flower.scale.set(0.5);
        let flowerCenter = new Sprite(loader.resources.flowerCenter.texture);
        flowerCenter.anchor.set(0.5);
        flowerCenter.scale.set(0.6);
        

        timeStamp = new text(flowerData[i].timestamp, timeStampStyle);
        timeStamp.anchor.set(0.5);
        timeStamp.y = 180;
        flower.addChild(flowerCenter);
        flower.addChild(timeStamp);
        oldFlowerCont.addChild(flower);
        flower.x = ((count % 3) * 170) + page * 600 ;
        flower.y = Math.floor(count / 3) * 200;
        count ++;
        
    }
    
    //create page count text
    this.pageCountText = new text('Page ' + (this.currentPage + 1) + " of " + (this.pageCount + 1), timeStampStyle);
    this.pageCountText.anchor.set(0.5);
    this.pageCountText.scale.set(0.5);
    this.pageCountText.x = 200;
    this.pageCountText.y = -357;
    this.sprite.addChild(this.pageCountText);
    
    //create close button
    this.closeSprite = new Sprite(loader.resources.closeBtn.texture);
    this.closeSprite.anchor.set(0.5);
    this.closeSprite.y = 335;
    this.sprite.addChild(this.closeSprite);
    this.closeSprite.interactive = true;
    this.closeSprite.on('pointerdown', function(e) {
        gardenPanelObj.hide();
    });
    
    // create page left button
    this.pageLeftSprite = new Sprite(loader.resources.leftBtn.texture);
    this.pageLeftSprite.anchor.set(0.5);
    this.pageLeftSprite.y = 335;
    this.pageLeftSprite.x = -167;
    this.sprite.addChild(this.pageLeftSprite);
    this.pageLeftSprite.interactive = true;
    this.pageLeftSprite.on('pointerdown', function(e) {
        if(gardenPanelObj.currentPage != 0){
            oldFlowerCont.x += 600;
            gardenPanelObj.currentPage -= 1;
            gardenPanelObj.pageCountText.text = 'Page ' + (gardenPanelObj.currentPage + 1) + " of " + (gardenPanelObj.pageCount + 1);
        }
    });
    
    // create page right button
    this.pageRightSprite = new Sprite(loader.resources.rightBtn.texture);
    this.pageRightSprite.anchor.set(0.5);
    this.pageRightSprite.y = 335;
    this.pageRightSprite.x = 167;
    this.sprite.addChild(this.pageRightSprite);
    this.pageRightSprite.interactive = true;
    this.pageRightSprite.on('pointerdown', function(e) {
        if(gardenPanelObj.currentPage < gardenPanelObj.pageCount){
            oldFlowerCont.x -= 600;
            gardenPanelObj.currentPage += 1;
            gardenPanelObj.pageCountText.text = 'Page ' + (gardenPanelObj.currentPage + 1) + " of " + (gardenPanelObj.pageCount + 1);
        }

    });
    
    
    this.show = function(){
        //move the panel into the screen view
        this.sprite.x = canvWidth / 2;
        this.sprite.y = canvHeight / 2;
    }
    
    this.hide = function(){
        //move the panel out of the screen view
        this.sprite.x = -1000;
        this.sprite.y = -1000;
    }
}