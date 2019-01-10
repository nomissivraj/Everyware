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

//bool to track whether pers data is empty
var emptyData;

//to track the DEBUG mode entry
var debugCodeCount = 0;
var debugCount = 0;

//dummy entries for use in debug mode
var dummyEntries = [
    "Well, today wasn’t half bad. Woke up after a lie in and made myself some cereal which was great. No one was home considering it was the weekend so I had a whole house to myself for most of the day. I just lounged around, watched TV, played games, and just generally wasted the day away. I guess it wasn’t productive but sometimes you just need those lazy days. But anyways, my housemate came home later in the day and cooked a huge roast dinner for us and some friends we invited round – and he cooks a mean roast. That’s basically the day really, nothing particularly interesting but it was enjoyable.",
    "Hey diary, just wanted to say that I had one hell of a time at Thorpe Park with some mates today. Haven’t been in there in a long time and I almost forgot just how much I love roller coasters. One of the guys wimped out though and didn’t go on most of the rides but oh well, he tagged along for everything else at least. Only bad thing I can think of is the long and tiring car journey, but other than that it was all pretty good. Hopefully I can go to a theme park again, I definitely miss them.",
    "Well, I’m pretty sure I’m in trouble at work now. Some customer was being rude and just wouldn’t accept anything apart from a full refund. Apparently taking down one item wrong on his order warrants a full refund. We offered a refund for the one pizza which was wrong and even said he could have it on the house as well as the correct pizza, but he was so demanding. I know I shouldn’t have told him to “Stop complaining about everything” but he was just aggressive, and I wasn’t going to just take it. The customer is not always right and I hate that people say they should be.",
    "Dear diary, I got my grades back for my mock exams today and did brilliantly. Honestly didn’t expect that since I hate the subject but I’ll take it. Even my sciences were good despite them being my worst subjects. Thought I’d get my best marks in History honestly but it was near enough. Hopefully I do just as well when the real exams come but until then I shouldn’t worry. At least I did better than David though, he’s supposedly the smartest in the year group but I think a few people outperformed him. At least he isn’t cocky about how smart he is though. Anyway that’s about it, goodnight!",
    "Had quite a lazy day today, it’s a weekend so what can I say? Parent’s weren’t home either since they’re visiting my sister at university so I’m basically home alone until the evening. I literally woke up at 3 in the afternoon and just stayed in bed on my phone. Not exactly productive but I had no plans. Mum and Dad got home by like 7 anyways and apparently my sister’s doing fine, still stroppy as normal so nothing new there. We ordered takeaway for dinner since it was late and then we just watched TV. Well, they did, I just sat in the armchair on my phone and barely watched the show they were watching.",
    "So, today I had one of those days where for some reason everything just annoyed me. I think it started because my housemate doesn’t know how to make a damn cup of tea, I mean, how can you not!? It’s just water and tea – and milk if you want it. And does he have to spend over an hour in the shower. We have 1 toilet between the 3 of us and I just sat there waiting, holding in my bladder for an age. The supermarket was out of bread as well which sucked, but I wouldn’t have needed bread if Martin hadn’t dropped the entire loaf on the floor. This is basically me just ranting at this point so I’ll just stop. It’s just frustrating is all.",
    "I’ve genuinely never been a rock fan, but I was convinced to attend a Fall Out Boy concert with a group of friends and wow it was great. I’d never been to a concert before today and wow, the atmosphere and the people. So loud but so exciting. It probably would have helped if I knew their music but because I was invited quite last minute I barely had time to even look them up. There was one song though which I had heard before so I knew the chorus at least. Guess I should give the band a listen at some point, I guess rock isn’t too bad.",
    "Actually can’t believe my parents had a go at me for being ‘lazy’ when my brother does literally nothing around the house. Just because it’s exam season for him he gets a free pass. I do the dishes, I vacuum every inch of the house, take out the trash and replace the bin bags and when they tell me to put food into the dog’s food bowl, apparently telling them to “wait a minute” isn’t acceptable. Just be patient for goodness sake, I’m not even refusing. I still did it in the end anyway but still, it’s always me isn’t it?"
]; 

//Load images and JSON
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
    .add('infoBtn', "assets/infoBtn.png")
    .add('debugBtn', "assets/debugBtn.png")
    .add('makeEntryBtn', "assets/makeEntryBtn.png")
    .add('add1Btn', "assets/add1Btn.png")
    .add('add10Btn', "assets/add10Btn.png")
    .add('minus1Btn', "assets/minus1Btn.png")
    .add('minus10Btn', "assets/minus10Btn.png")
    .add('closeBtn', 'assets/closeBtn.png')
    .add('leftBtn', 'assets/leftBtn.png')
    .add('rightBtn', 'assets/rightBtn.png')
    .add('gardenPanel', 'assets/gardenPanel.png')
    .add('timeStampBack', 'assets/timeStampBack.png')
    .add('infoPanel', 'assets/infoPanel.png')
    .add('debugPanel', 'assets/debugPanel.png')
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
    
    emptyData = true;

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
    
    //if no flower is planted, make the ground interactive and plant new flower when  clicked
    if(!flowerPlanted){
        groundSprite.interactive = true;
        groundSprite.on('pointerdown', function(e){
            createNewFlower();  
        });
    }
    
    
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
    
    //set index of cloud container in sprite container to position it behind flower
    spriteContainer.setChildIndex(cloudContainer, 1);
    
    //create the first clouds
    for(var i = 0; i < (cloudNum / 2); i++){ //create half the number of clouds wanted when start, and spawn the rest off screen
    clouds.push(new Cloud(cloudContainer, true));
    }
    
    //create the panel objects
    gardenPanelObj = new gardenPanel();
    infoPanelObj = new infoPanel();
    debugPanelObj = new debugPanel();
    
    //create buttons at top of screen
    createButtons(btnContainer);
    
    //add keydown event listener for debug mode
    document.addEventListener('keydown', onKeyDown);

    
    //start the gameloop
    drawLoop();
    
}

function drawLoop(){
    
    requestAnimationFrame(drawLoop);
    
    //for every cloud, run the move function
    for(var i = 0; i < clouds.length; i++){
        clouds[i].move(i);
    }
    
    //if there is less clouds than the specified number, make more
    if(clouds.length < cloudNum){
        clouds.push(new Cloud(cloudContainer, false));
    }
        
}

function parsePersonality(data){
    
    //holds the parsed JSON
    parsedData = JSON.parse(data);
    
    //if there is data, get the scores and store them
    if(parsedData.length > 0){
        lastEntry = parsedData[parsedData.length - 1];
        if (lastEntry.big5_agreeableness === 0 && lastEntry.big5_conscientiousness === 0 && lastEntry.big5_extraversion === 0 && lastEntry.big5_neuroticism === 0 && lastEntry.big5_openness === 0){
            agreeablenessScore = 50;
            conscientiousnessScore = 50;
            extraversionScore = 50;
            neuroticismScore = 50;
            opennessScore = 50;
        } else {
            emptyData = false;
            opennessScore = lastEntry.big5_openness;
            conscientiousnessScore = lastEntry.big5_conscientiousness;
            extraversionScore = lastEntry.big5_extraversion;
            agreeablenessScore = lastEntry.big5_agreeableness;
            neuroticismScore = lastEntry.big5_neuroticism;
        }

    } else {
        //if there is no data, use temp scores of 50.
        opennessScore = 50;
        conscientiousnessScore = 50;
        extraversionScore = 50;
        agreeablenessScore = 50;
        neuroticismScore = 50;
    }
}

function setupActiveFlower(data){
    activeFlowerJSON = JSON.parse(data);
    
    //if no flower is planted
    if(activeFlowerJSON.length == 0){
        flowerPlanted = false;
        noFlowerText = new text('No flower planted! Tap the ground to plant a seed!', style);
        noFlowerText.anchor.set(0.5);
        noFlowerText.x = canvWidth / 2;
        noFlowerText.y = canvHeight * 0.95;
        spriteContainer.addChild(noFlowerText);
        
    } else {
        flowerPlanted = true;
        
        //set up flower variables, to be passed when creating the flower
        let color = activeFlowerJSON[0].color;
        let petals = activeFlowerJSON[0].petals;
        let currentScore = activeFlowerJSON[0].currentFlowerScore;
        
        let oldScore = activeFlowerJSON[0].oldFlowerScore;
        
        //create new flower object using the values grabbed above
        activeFlower = new Flower(color, petals, currentScore, oldScore, true, spriteContainer);
        
        //if the flower is fully grown
        if(currentScore >= 100){
            flowerComplete = true;
            flowerCompleteText = new text('Flower Complete! Tap to save and plant a new seed.', style);
            flowerCompleteText.anchor.set(0.5);
            flowerCompleteText.x = canvWidth / 2;
            flowerCompleteText.y = canvHeight * 0.95;
            spriteContainer.addChild(flowerCompleteText);
            activeFlower.flowerSprite.interactive = true;
            activeFlower.flowerSprite.on('pointerdown', function(e){
                createNewFlower();  
            });
        }
    }
    
}

//function to create a new flower
function createNewFlower(){
    
    //create new object to be passed to server
    let newFlower = {
        color: petalColors[getRandomInt(0, petalColors.length - 1)], //get random int between 0 and the amount of colours.
        petals: getRandomInt(0, 7), //random petal type
        currentFlowerScore: 0,
        oldFlowerScore: 0
    }
    if(!flowerPlanted) spriteContainer.removeChild(noFlowerText); //remove text if no flower was planted
    if(flowerComplete) {
        spriteContainer.removeChild(flowerCompleteText); //remove text if flower was complete
        
        spriteContainer.removeChild(activeFlower.flowerSprite); //remove old flower sprite
    }
    //create temp flower with score of 0
    activeFlower = new Flower(0, 0, 0, 0, true, spriteContainer);
    flowerPlanted = true;
    flowerComplete = false;
    socket.emit('newFlower', newFlower); //use sockets to send object to server to be pushed to db
}

//set up the number of clouds
function setupCloudVariables(){
    let invertScore = 100 - opennessScore;
    cloudNum = Math.floor((invertScore * 10) / 100);
    
    
}


//functions to get random floats and ints
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
    
    //set cloud speed according to conscientiousness value
    let speed = 0.2 + getRandomFloat(0, 0.5);
    
    //multplier, min is 0.3, max 2, range is 1.7
    let invertScore = 100 - conscientiousnessScore;
    let speedMod = ((invertScore * 1.7) / 100) + 0.3
    
    this.speed = speed * speedMod;
    
    
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
        //if any other panels are on screen, close them
        if(infoPanelObj.onScreen){
            infoPanelObj.hide();
        } else if(debugPanelObj.onScreen){
            debugPanelObj.hide();
        }
        //show the panel
        gardenPanelObj.show();
    });
    
    parent.addChild(gardenBtnSprite);
    
    //create info button
    let infoBtnSprite = new Sprite(loader.resources.infoBtn.texture);
    infoBtnSprite.anchor.set(0.5);
    infoBtnSprite.position.set(125, 45);
    
    infoBtnSprite.interactive = true;
    infoBtnSprite.on('pointerdown', function(e){
        //if any other panels are on screen, close them
        if(gardenPanelObj.onScreen){
            gardenPanelObj.hide();
        } else if(debugPanelObj.onScreen){
            debugPanelObj.hide();
        }
        //show the panel
        infoPanelObj.show();
    });
    
    parent.addChild(infoBtnSprite);    
    
    
}

function gardenPanel(){
    
    //create and position sprite off screen
    this.sprite = new Sprite(loader.resources.gardenPanel.texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(-1000, -1000);
    this.sprite.interactive = true;
    this.currentPage = 0;
    this.pageCount = 0;
    this.onScreen = false;
    app.stage.addChild(this.sprite);
    
    //populate panel with flowers using info from database
    //console.log(JSON.parse(loader.resources.previousFlowersJSON.data));
    let flowerData = JSON.parse(loader.resources.previousFlowersJSON.data);
    
    //create new container to hold flower sprites
    let oldFlowerCont = new PIXI.Container();
    oldFlowerCont.x = -170; 
    oldFlowerCont.y = -250;
    this.sprite.addChild(oldFlowerCont);
    
    //set up text style for use with timestamp
    var timeStampStyle = new PIXI.TextStyle({
        align: 'center',
        fill:0xFFFFFF,
        fontWeight: 'bold',
        fontSize: 30,
        dropShadow: false,
        dropShadowAlpha: 0.5,
        dropShadowDistance: 3,
        wordWrap: true,
        wordWrapWidth: 200
    });
    
    var count = 0; //hold the flower number relative to the page, 0-9
    var page = 0; //hold the page number, used for position calculation and on screen text
    
    for(var i = flowerData.length - 1; i >= 0; i--){
        //if the 10th flower made, reset the count and increment page count.
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
        
        let timeStampBackSprite = new Sprite(loader.resources.timeStampBack.texture);
        timeStampBackSprite.anchor.set(0.5);
        timeStampBackSprite.scale.set(2);
        timeStampBackSprite.y = 178;
        
        
        let tempTime = flowerData[i].timestamp;
        let timeArray = tempTime.split(' '); //split the timestamp to just get date
        let timeStamp = new text(timeArray[0], timeStampStyle);
        timeStamp.anchor.set(0.5);
        timeStamp.y = 180;
        flower.addChild(flowerCenter);
        flower.addChild(timeStampBackSprite);
        flower.addChild(timeStamp);
        oldFlowerCont.addChild(flower);
        
        //position the flower using the page number and the page specific count. Next pages are just stored off the screen
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
        if(gardenPanelObj.currentPage != 0){ //if not on the first page
            //move the flower container to show the previous page, and decrement the current page number.
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
        if(gardenPanelObj.currentPage < gardenPanelObj.pageCount){ //if not on the last page
            //move the flower container to show the next page, and increment the current page number.
            oldFlowerCont.x -= 600;
            gardenPanelObj.currentPage += 1;
            gardenPanelObj.pageCountText.text = 'Page ' + (gardenPanelObj.currentPage + 1) + " of " + (gardenPanelObj.pageCount + 1);
        }

    });
    
    
    this.show = function(){
        //move the panel into the screen view
        this.onScreen = true;
        this.sprite.x = canvWidth / 2;
        this.sprite.y = canvHeight / 2;
    }
    
    this.hide = function(){
        //move the panel out of the screen view
        this.onScreen = false;
        this.sprite.x = -1000;
        this.sprite.y = -1000;
    }
}

function infoPanel(){
    
    //create and position sprite off screen
    this.sprite = new Sprite(loader.resources.infoPanel.texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(-1000, -1000);
    this.sprite.interactive = true;
    this.onScreen = false;
    app.stage.addChild(this.sprite);
    
    this.scoreStyle = new PIXI.TextStyle({
        align: 'center',
        fill:0xF6851F,
        fontWeight: 'bold',
        fontSize: 30,
    });
    
    //create close button
    this.closeSprite = new Sprite(loader.resources.closeBtn.texture);
    this.closeSprite.anchor.set(0.5);
    this.closeSprite.y = 355;
    this.sprite.addChild(this.closeSprite);
    this.closeSprite.interactive = true;
    this.closeSprite.on('pointerdown', function(e) {
        infoPanelObj.hide();
    });
    
    //create score text array.
    let scoreArray = [
        agreeablenessScore,
        conscientiousnessScore,
        opennessScore,
        extraversionScore,
        neuroticismScore
    ];
    //create and position score text sprites;
    for(var i = 0; i < scoreArray.length; i++){
        let scoreValue = "N/A";
        if(!emptyData) scoreValue = scoreArray[i];
        let scoreText = new text(scoreValue, this.scoreStyle);
        scoreText.anchor.set(0.5);
        scoreText.scale.set(0.6);
        scoreText.position.set(48, 165 + (i * 32)); //165
        this.sprite.addChild(scoreText);
    
        //if the first value (agreeableness) set up interactivity to enable dubg mode after 10 clicks
        if(i == 0){
            scoreText.interactive = true;
            scoreText.on('pointerdown', function(e){
                debugCount++; 
                if(debugCount == 10){
                    console.log('debug mode activated');
                    debugMode(btnContainer);
                }
            });
        }
            
    }
    
    
    
    this.show = function(){
        //move the panel into the screen view
        this.sprite.x = canvWidth / 2;
        this.sprite.y = canvHeight / 2;
        this.onScreen = true;
    }
    
    this.hide = function(){
        //move the panel out of the screen view
        this.onScreen = false;
        this.sprite.x = -1000;
        this.sprite.y = -1000;
    }
}

//keydown function
function onKeyDown(key){
    
    //check for user typing word "debug"
    if(debugCodeCount === 0 && key.keyCode === 68){
        debugCodeCount ++;
    } else if(debugCodeCount === 1 && key.keyCode === 69){
        debugCodeCount ++;
    } else if(debugCodeCount === 2 && key.keyCode === 66){
        debugCodeCount ++;
    } else if(debugCodeCount === 3 && key.keyCode === 85){
        debugCodeCount ++;
    } else if(debugCodeCount === 4 && key.keyCode === 71){
        console.log("debug mode activated");
        debugMode(btnContainer);
        
    } else {
        debugCodeCount = 0;
    }
}


//debug mode

function debugMode(parent){
    

    
    //create debug button
    let debugBtnSprite = new Sprite(loader.resources.debugBtn.texture);
    debugBtnSprite.anchor.set(0.5);
    debugBtnSprite.position.set(205, 45);
    debugBtnSprite.interactive = true;
    debugBtnSprite.on('pointerdown', function(e){
        if(gardenPanelObj.onScreen){
            gardenPanelObj.hide();
        } else if( infoPanelObj.onScreen){
            infoPanelObj.hide();
        }
        debugPanelObj.show();
    });
    parent.addChild(debugBtnSprite);  
}

function debugPanel(){
    
    //create and position sprite off screen
    this.sprite = new Sprite(loader.resources.debugPanel.texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(-1000, -1000);
    this.sprite.interactive = true;
    this.onScreen = false;
    app.stage.addChild(this.sprite);
    
    //create entry button
    this.entrySprite = new Sprite(loader.resources.makeEntryBtn.texture);
    this.entrySprite.anchor.set(0.5);
    this.entrySprite.y = -150;
    this.sprite.addChild(this.entrySprite);
    this.entrySprite.interactive = true;
    this.entrySprite.on('pointerdown', function(e){
        dummyEntryIndex = Math.floor(Math.random() * dummyEntries.length);
        console.log("Inserted entry: " + dummyEntries[dummyEntryIndex]);
        socket.emit('fakeEntry', dummyEntries[dummyEntryIndex]);
    });
    
    //create flower score buttons
    //plus 1 button
    this.plus1Sprite = new Sprite(loader.resources.add1Btn.texture);
    this.plus1Sprite.anchor.set(0.5);
    this.plus1Sprite.position.set(70, 150);
    this.sprite.addChild(this.plus1Sprite);
    this.plus1Sprite.interactive = true;
    this.plus1Sprite.on('pointerdown', function(e){
        socket.emit('adjustFlower', 1);
    });
    
    //plus 10 button
    this.plus10Sprite = new Sprite(loader.resources.add10Btn.texture);
    this.plus10Sprite.anchor.set(0.5);
    this.plus10Sprite.position.set(170, 150);
    this.sprite.addChild(this.plus10Sprite);
    this.plus10Sprite.interactive = true;
    this.plus10Sprite.on('pointerdown', function(e){
        socket.emit('adjustFlower', 10);
    });
    
    //minus 1 button
    this.minus1Sprite = new Sprite(loader.resources.minus1Btn.texture);
    this.minus1Sprite.anchor.set(0.5);
    this.minus1Sprite.position.set(-70, 150);
    this.sprite.addChild(this.minus1Sprite);
    this.minus1Sprite.interactive = true;
    this.minus1Sprite.on('pointerdown', function(e){
        socket.emit('adjustFlower', -1);
    });
    
    //minus 10 button
    this.minus10Sprite = new Sprite(loader.resources.minus10Btn.texture);
    this.minus10Sprite.anchor.set(0.5);
    this.minus10Sprite.position.set(-170, 150);
    this.sprite.addChild(this.minus10Sprite);
    this.minus10Sprite.interactive = true;
    this.minus10Sprite.on('pointerdown', function(e){
        socket.emit('adjustFlower', -10);
    });
        
    //create close button
    this.closeSprite = new Sprite(loader.resources.closeBtn.texture);
    this.closeSprite.anchor.set(0.5);
    this.closeSprite.y = 355;
    this.sprite.addChild(this.closeSprite);
    this.closeSprite.interactive = true;
    this.closeSprite.on('pointerdown', function(e) {
        window.location.reload(true);
        debugPanelObj.hide();
    });
        
    
    
    this.show = function(){
        //move the panel into the screen view
        this.sprite.x = canvWidth / 2;
        this.sprite.y = canvHeight / 2;
        this.onScreen = true;
    }
    
    this.hide = function(){
        //move the panel out of the screen view
        this.onScreen = false;
        this.sprite.x = -1000;
        this.sprite.y = -1000;
    }
}