function Flower(color, petals, currentScore, oldScore, active){
    this.color = color;
    this.petals = petals;
    this.currentScore = currentScore;
    this.health = currentScore - oldScore;
    console.log("hello");
    
    if(active){
        if(currentScore <= 20){
            let img = flower0;
            this.sprite = new Sprite(img, canvWidth * 0.5, canvHeight * 0.8, 1, 255, 0, 1);

        } else if(this.currentScore <= 50){
            var img

            if(this.health > 0){
                img = flower1;
            } else {
                img = illFlower1;
            }

            this.sprite = new Sprite(img, canvWidth * 0.5, canvHeight * 0.75, 1, 255, 0, 1);
        } else if(this.currentScore <= 70){
            var img

            if(this.health > 0){
                img = flower2;
            } else {
                img = illFlower2;
            }

            this.sprite = new Sprite(img, canvWidth * 0.5, canvHeight * 0.70, 1, 255, 0, 1);
        } else if(this.currentScore < 100){
            var img

            if(this.health > 0){
                img = flower3;
            } else {
                img = illFlower3;
            }

            this.sprite = new Sprite(img, canvWidth * 0.5, canvHeight * 0.65, 1, 255, 0, 1);
        }
        if(currentScore >= 100){
            let img = flower4;
            this.sprite = new Sprite(img, canvWidth * 0.5, canvHeight * 0.55, 1, 255, 0, 1);
        }
    }
}