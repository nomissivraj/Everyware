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
        if(currentScore >= 100){
            this.state = "flower4";
        }
        
        let flowerSprite = new Sprite(loader.resources[this.state].texture);
        flowerSprite.anchor.set(0.5, 1);
        flowerSprite.position.set(canvWidth * 0.5, canvHeight * 0.9);
        parent.addChild(flowerSprite);
        
        
        
    }
    
    
    
}