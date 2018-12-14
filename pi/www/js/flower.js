function Flower(color, petals, currentScore, oldScore, active, parent){
    this.color = color;
    this.petals = petals;
    this.currentScore = currentScore;
    this.health = currentScore - oldScore;
    this.state;
    
    if(active){
        if(currentScore <= 20){
            this.state = "flower0";
        } else if(this.currentScore <= 50){
            if(this.health >= 0){
                this.state = "flower1";
            } else {
                this.state = "illflower1";
            }
        } else if(this.currentScore <= 70){
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
        
        flowerSprite = new Sprite(loader.resources[this.state].texture);
        flowerSprite.anchor.set(0.5, 1);
        flowerSprite.position.set(canvWidth * 0.5, canvHeight * 0.8);
        if(this.currentScore >= 100){
            
            //draw the petals and tint
            let petalString = "petals" + this.petals;
            
            let petalSprite = new Sprite(loader.resources[petalString].texture);
            petalSprite.anchor.set(0.5);
            petalSprite.tint = this.color;
            petalSprite.y = -300;
            flowerSprite.addChild(petalSprite);
            
            //create the center of the flower
            let flowerCenter = new Sprite(loader.resources.flowerCenter.texture);
            flowerCenter.anchor.set(0.5);
            flowerCenter.y = -300;
            flowerSprite.addChild(flowerCenter);
        }
        parent.addChild(flowerSprite);
        
        
        
    }
    
    
    
}