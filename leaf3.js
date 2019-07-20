
  //document.getElementById("game-board").style.display = "none";
  const myCanvas = document.getElementById("the-canvas");
  const ctx = myCanvas.getContext("2d");

  /////////////////////////////////////////////////////////////////
  /////////////////// Classes Section /////////////////////////////
  /////////////////////////////////////////////////////////////////

  /////////////////////the leaf class//////////////////////////////
  class Leaf {
    
    constructor(){
      this.x = 15;
      this.y = 250;
      this.width = 50;
      this.height = 80;
      this.img = "./images/mari2.png";
      this.speedX = 0;
      this.speedY = 0;
      this.gravity = 0.5;
      this.gravitySpeed = 0;
      this.bottom = myCanvas.height;
      this.top = 0;
    }
    
    // draw the leaf
    drawLeaf(){
      const leafImg = new Image();
      leafImg.src = this.img;
      ctx.drawImage(leafImg, this.x, this.y, this.width, this.height);
    }
    
    // gravity stuff
    gravityEffect(){
        this.hitTop();
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
      this.hitBottom();
      
    }
    
    // check if it hits bottom
    hitBottom() {
      if(this.y > (this.bottom - this.height)){
        this.y = (this.bottom - this.height);
        this.gravitySpeed = 0;
      }
    }
    
    // check if it hits top
    hitTop(){
      if(this.y < (5)){
        this.y = (5);
        return true;
      }
      return false;
    }
    
    // recieve -5 on keydown, recieve .2 on keyup
    accelerate(n){
      this.gravity = n;
    }

    leafVertexXcoord(){
      return this.x + (.5 * this.width);
    }

    leafVertexYcoord(){
      return this.y + (.5 * this.height);
    }
    
  }
 
//////////////////////////////the obstacles class///////////////////
  class Obstacles {
    
    constructor(x,y,width,height){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
    
    // draw the obstacle
    drawObstacles(){
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // move obstacle left
    moveLeft(){
      this.x -= 10; 
    }

    obstacleVertexXcoord(){
      return this.x + (.5 * this.width);
    }

    obstacleVertexYcoord(){
      return this.y + (.5 * this.height);
    }

  }
  
////////////////////////the building class////////////////////////////
  class buildings {

    constructor(x,y,width,height, image){
      this.x = 850;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = image;
    }

    // draw building
    drawBuilding(){
      const buildingImg = new Image();
      buildingImg.src = this.img;
      ctx.drawImage(buildingImg, this.x, this.y, this.width, this.height);
    }

    // move building left
    moveLeft(){
      this.x -= 10;
    }
  }

//////////////////////////the bird class////////////////////////////
  class Bird {
    
    constructor(y,width, height){
      this.x = myCanvas.width + 200;
      this.y = y;
      this.width = 80;
      this.height = 80;
      this.img = "./images/funnyRaven.png";
    }
    
    // draw the bird
    drawBird(){
      const birdImg = new Image();
      birdImg.src = this.img;
      ctx.drawImage(birdImg, this.x, this.y, this.width, this.height);
    }
    
    // move the bird left
    moveLeft(){
      this.x -= 10;
    }
  }           

////////////////////////////the Game class/////////////////////////////
  class Game {

    constructor(){
      this.leaf = {}; // leaf => object
      this.skyscrapers = [];
      this.buildings = [];
      this.birds = [];
      this.score = 0;
    }
  }

  // listen for keystrokes
  document.onkeydown = function (e) {
    
    const up = e.keyCode;
    const jump = -.5;
    
    if(up ===32){
      // if currentLeaf has not hit the top then jump
      if(!currentLeaf.hitTop()){
        currentLeaf.accelerate(jump);
      }
      
    }
  }
  
  // when there are no keystrokes
  document.onkeyup = function () {
    let down = .2;
    currentLeaf.accelerate(down);
  }

  /////////////////////////////////add score/////////////////////////////
  let newScore = 0;
  function addScore(){
    newScore++;
  }
  
  
  // Create objects/instances of the classes
  const currentGame = new Game();
  const currentLeaf = new Leaf();
  currentGame.leaf = currentLeaf;
  
  
  ///////////////////////////the animation loop//////////////////////////
  let frames = 0;
  function refresh(){
    
    // clear canvas before drawing
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    // draw leaf
    currentLeaf.drawLeaf();
    // apply gravity
    currentLeaf.gravityEffect();

    frames++;
    
    if(frames % 150 === 1){
      
      // create bird object
      randomBirdY = Math.floor(Math.random() * 650);
      let currentBird = new Bird(randomBirdY);
      currentGame.birds.push(currentBird);
      
      
    }
    
    if (frames % 100 === 1){
      
      // create min & max for specific obstacle range
      let min = 500;
      let max = 525;
      
      // randomize parameters for obstacle object 
      obstacleX = myCanvas.width;
      let randomY = Math.floor(Math.random() * (max - min + 1)) + min;
      
      obstacleWidth = 100;
      obstacleHeight = myCanvas.height - randomY;
      
      let obstacle = new Obstacles (obstacleX, randomY, obstacleWidth, obstacleHeight); 
      
      // push array
      currentGame.skyscrapers.push(obstacle);
      
    }
    
    
    // iterate through the array of skycrapers; move objects/skyscrapers left and draw
    for(let i = 0; i < currentGame.skyscrapers.length; i++){
      
      currentGame.skyscrapers[i].moveLeft();
      
      //////////////////////////detect collision/////////////////////////////
  
        const leafVertexX = currentLeaf.leafVertexXcoord();
        const leafVertexY = currentLeaf.leafVertexYcoord();
        const obstacleVertexX = currentGame.skyscrapers[i].obstacleVertexXcoord();
        const obstacleVertxY = currentGame.skyscrapers[i].obstacleVertexYcoord();
  
        let vertexWidth = Math.abs(leafVertexX - obstacleVertexX).toFixed(2);
        let vertexHeight = Math.abs(leafVertexY - obstacleVertxY).toFixed(2);

        console.log("leaf vertex coordinates are: (", leafVertexX, ",", leafVertexY,")");
        console.log("obstacle vertex coordinates are: (", obstacleVertexX, ",", obstacleVertxY,")");
        console.log("vertex width: ", vertexWidth, " and vertex height is: ", vertexHeight)
  
        function xCollision(){
          if(vertexWidth < ((.5 * currentLeaf.width) + (.5 * currentGame.skyscrapers[i].width))){
            console.log("X collission!");
            return true;
          }
          return false;
        }
          
        function yCollision(){
          
          if(vertexHeight < ((.5 * currentLeaf.height) + (.5 * currentGame.skyscrapers[i].height))){
            console.log("Y collision!");
            return true;
          } 
          return false;
        }

        if((xCollision()) && (yCollision())){
          console.log("BOOOOOOOOOM!!!!");
        }
        
      ////////////////////////////////////////////////////////////////////////////////

      currentGame.skyscrapers[i].drawObstacles();

      if(currentGame.skyscrapers[i].x + currentGame.skyscrapers[i].width < 0){

        currentGame.skyscrapers.shift();
      }
    }

    
    // iterate through the array of birds; move objects/birds left and draw
    for(let k = 0; k < currentGame.birds.length; k++){

      currentGame.birds[k].moveLeft();
      currentGame.birds[k].drawBird();
    }  
    
    // loop again
    requestAnimationFrame(refresh);

  }


  // start the recursive function refresh()
  refresh();


