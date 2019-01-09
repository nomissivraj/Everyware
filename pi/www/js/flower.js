function Flower(color, petals, currentScore, oldScore, active, parent){
    this.color = color;
    this.petals = petals;
    this.currentScore = currentScore;
    this.health = currentScore - oldScore;
    this.state;
    
    if(active){ //if the flower is the main active one
        
        //if statement to decide flower growth state, using string
        if(currentScore <= 20){
            this.state = "flower0";
        } else if(this.currentScore <= 40){
            if(this.health >= 0){
                this.state = "flower1";
            } else {
                this.state = "illflower1";
            }
        } else if(this.currentScore <= 60){
            if(this.health >= 0){
                this.state = "flower2";
            } else {
                this.state = "illflower2";
            }
        } else if(this.currentScore < 100){
            if(this.health >= 0){
                this.state = "flower3";
            } else {
                this.state = "illflower3";

            }
        }
        if(this.currentScore >= 100){
            this.state = "flower4";
        }
        
        this.flowerSprite = new Sprite(loader.resources[this.state].texture); //set flower sprite using string defined above
        this.flowerSprite.anchor.set(0.5, 1); //set the sprites anchor to the bottom middle of the image
        this.flowerSprite.position.set(canvWidth * 0.5, canvHeight * 0.84);
        if(this.currentScore >= 100){
            
            //draw the petals and tint
            let petalString = "petals" + this.petals; //use this.petals to make concatenated string
            let petalSprite = new Sprite(loader.resources[petalString].texture);
            petalSprite.anchor.set(0.5);
            petalSprite.tint = this.color; //tint using color
            petalSprite.y = -600;
            this.flowerSprite.addChild(petalSprite);
            
            //create the center of the flower
            let flowerCenter = new Sprite(loader.resources.flowerCenter.texture);
            flowerCenter.anchor.set(0.5);
            flowerCenter.y = -600;
            this.flowerSprite.addChild(flowerCenter);
        }
        this.flowerSprite.scale.set(0.8);
        parent.addChild(this.flowerSprite);
        
        
        
    }
    
    else if(!active) { //if the flower is not active (meaning its in the previous flower panel)
        let petalString = "petals" + this.petals; //create the petal type string 
        let petalSprite = new Sprite(loader.resources[petalString].texture); //use the string to create the petal sprite
        petalSprite.anchor.set(0.5);
        petalSprite.tint = this.color; //tint with color
        parent.addChild(petalSprite);
        
        
    }
    
    
    
}