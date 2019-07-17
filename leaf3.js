
  //document.getElementById("game-board").style.display = "none";
  const myCanvas = document.getElementById("the-canvas");
  const ctx = myCanvas.getContext("2d");

  
  class Game {

    constructor(){
      this.leaf = {}; // leaf => object
      this.skyscrapers = [];
      this.birds = [];
      this.score = 0;
    }
  }

  class Leaf {
    
    constructor(name,x,y,width,height){
      this.name = name;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.img = "./images/leaf1.png";
      this.speedX = 0;
      this.speedY = 0;
      this.gravity = 0.5;
      this.gravitySpeed = 0;
      this.bottom = 700;
    }
  
    // draws the leaf
    drawLeaf(){
      const leafImg = new Image();
      leafImg.src = this.img;
      ctx.drawImage(leafImg, this.x, this.y, this.width, this.height);
    }

    gravityEffect(){
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;
      this.hitBottom();
    }

    hitBottom() {
      if(this.y > (this.bottom - this.height)){
        this.y = (this.bottom - this.height);
        this.gravitySpeed = 0;
      }
    }

    accelerate(n){
      this.gravity = n;
    }


  }

  class Obstacles {

    constructor(x,y,width, height){
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    drawObstacles(){
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    moveLeft(){
      this.x -= 10;
    }
  }

    
      // listens for keystrokes
  document.onkeydown = function (e) {
    console.log(`what is e: `, e);
    
    let up = e.keyCode;
    let jump = -.05;
    switch(up){
      case 32:
        currentLeaf.accelerate(jump);
        break;
      default:
        console.log("default reached");
    }
  }


  document.onkeyup = function () {
    let down = .2;
    currentLeaf.accelerate(down);
  }

  

  const currentGame = new Game();
  const currentLeaf = new Leaf("anthony", 100,250,50,80);
  currentGame.leaf = currentLeaf;


 /*    document.getElementById("start-button").onclick = function() {
    startGame();
  }

  function startGame(){

    console.log(`startGame() invoked`);
    console.log();
    document.getElementById("game-board").style.display = "block";

  
    //currentLeaf.drawLeaf();


    refresh();
  } */
  

  let frames = 0;
  function refresh(){

    ctx.clearRect(0,0,800,700);
    currentLeaf.drawLeaf();
    currentLeaf.gravityEffect();
    console.log("name is: ", currentLeaf.name);
    //currentLeaf.gravityEffect();

    frames++;

     if(frames % 100 === 1){
      randomObstacleX = myCanvas.width;
      obstacleY = Math.floor(Math.random() * 600);
      randomObstacleWidth = Math.floor(Math.random() * 50) + 20;
      randomObstacleHeight = Math.floor(Math.random() * 50) + 20;
      let obstacle = new Obstacles (randomObstacleX, obstacleY, randomObstacleWidth, randomObstacleHeight);
      currentGame.skyscrapers.push(obstacle);
    }

    for(let i = 0; i < currentGame.skyscrapers.length; i++){
      
      currentGame.skyscrapers[i].moveLeft();
      currentGame.skyscrapers[i].drawObstacles();
    } 

    requestAnimationFrame(refresh);

  }

  refresh();


