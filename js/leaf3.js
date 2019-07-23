
  //document.getElementById("game-board").style.display = "none";
  const myCanvas = document.getElementById("the-canvas");
  const ctx = myCanvas.getContext("2d");

  
  const scoreSound = new Audio("../music/score.mp3");
  const jumpSound = new Audio("../music/jump.wav");
  const falling = new Audio("../music/falling.mp3");


  scoreSound.preload = 'auto';
  scoreSound.load();

  jumpSound.preload = `auto`;
  jumpSound.load();


  function playJumpSound(){
    let blah = jumpSound.cloneNode();
    blah.play();
  }

  function playScoreSound() {
    let click = scoreSound.cloneNode();
    click.play();
  }
  /////////////////////////////////////////////////////////////////
  /////////////////// Classes Section /////////////////////////////
  /////////////////////////////////////////////////////////////////

  /////////////////////parent object class/////////////////////////
  class Obstacles {

	  constructor(xCoordinate,yCoordinate,width,height,image){
		this.x = xCoordinate;
		this.y = yCoordinate;
		this.width = width;
		this.height = height;
		this.image = image;
	  }

	// draw obstacle
	  draw(){
		const someImg = new Image();
		someImg.src = this.image;
		ctx.drawImage(someImg, this.x, this.y, this.width, this.height);
	  	}
	
	// return X coordinate
	  vertexXcoord(){
		return this.x + (.5 * this.width);
	  	}
	
    // return Y coordinate 
	  vertexYcoord(){
		  return this.y + (.5 * this.height);
		}

	// move obstacle left
	  moveLeft(){
		  this.x -= 10; 
		}

  }

  /////////////////////the leaf class////////////////////////////////
  class Leaf extends Obstacles {
    
    constructor(){
		super(15,250,50,80,"../images/mari2.png");
		this.speedX = 0;
		this.speedY = 0;
		this.gravity = 0.5;
		this.gravitySpeed = 0;
		this.bottom = myCanvas.height;
		this.top = 0;
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
        gameOver();
      }
    }
    
    // check if it hits top
    hitTop(){
      if(this.y < 1){
        this.y = 1;
        return true;
      }
      return false;
    }
    
    // recieve -5 on keydown, recieve .2 on keyup
    accelerate(n){
      this.gravity = n;
    }

    
  }
 
//////////////////////////////the Building class///////////////////////
  class Building extends Obstacles {
    
    constructor(x,y,width,height){
		super(x,y,width,height, "../images/trump2.png");
    }
    

  }
  
//////////////////////////the bird class////////////////////////////////
  class Bird extends Obstacles {
    
    constructor(y,width, height){
		super(myCanvas.width + 200,y,80,80,"../images/trumpTweet.png");
    }
    
  }

///////////////////////////the Cheetos Class/////////////////////////////
  class Cheetos extends Obstacles {

    constructor(y){
      super(myCanvas.width + 200, y, 80, 80, "../images/cheetos.png");
    }
  }  

////////////////////////////the Cop class///////////////////////////////
  class Cop extends Obstacles{
	constructor(y){
		super(myCanvas.width + 200,y,100,120,"../images/trumpRocket.png");
	}
  }

////////////////////////////the Game class///////////////////////////////
  class Game {

    constructor(){
      this.leaf = {}; // leaf => object
      this.skyscrapers = [];
      this.cops = [];
      this.birds = [];
      this.goodies = [];
      this.score = 0;
    }
  }

  // listen for keystrokes
  document.onkeydown = function (e) {
    
    const up = e.keyCode;
    const jump = -.5;
    
    if(up ===32){
	  // play up sound effect
	  playJumpSound();
      // if currentLeaf has not hit the top then jump
      if(!currentLeaf.hitTop()){
        currentLeaf.accelerate(jump);
      }
	}
	
  }
  
  // when there are no keystrokes
  document.onkeyup = function () {
    let down = .2;
    fall();
    currentLeaf.accelerate(down);
  }

  /////////////////////////////////add score////////////////////////////////
  let newScore = 0;
  let score = document.getElementById('score');
  function addScore(){
    
    newScore++;
    score.innerHTML = newScore;
    playScoreSound();
    return;
  }

  /////////////////////////go to Game Over Page//////////////////////////////
  function gameOver(){
    window.location.href = "../html/youLose.html";
  }

  //////////////////////////go to You win Page///////////////////////////////
  function youWin(){
    window.location.href = "../html/youWin.html";
  }
  
  
  // Create objects/instances of the classes
  const currentGame = new Game();
  const currentLeaf = new Leaf();
  currentGame.leaf = currentLeaf;
  
  
  ///////////////////////////the animation loop//////////////////////////////
  let frames = 0;
  function refresh(){
    
    // clear canvas before drawing
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    // draw leaf
    currentLeaf.draw();
    // apply gravity
    currentLeaf.gravityEffect();

    frames++;
	
	  // every 150 frames
	  if(newScore > 14){

      if(frames % 150 === 1){
        
        // create bird object
        randomBirdY = Math.floor(Math.random() * 640);
        let currentBird = new Bird(randomBirdY);
        currentGame.birds.push(currentBird);
        
      }
    }
    
  

    if(frames % 125 === 1){
     // create cheetos or sprite can
      randomCheetosY = Math.floor(Math.random() * 620);

      console.log("cheetos.y = ", randomCheetosY);
      let currentCheetos = new Cheetos(randomCheetosY);
      currentGame.goodies.push(currentCheetos);
    }

  
    
    // create building object
    if(newScore > 4){

      if (frames % 100 === 1){
        
        // create min & max for specific obstacle range
        let min = 350;
        let max = 525;
        
        // randomize parameters for obstacle object 
        obstacleX = myCanvas.width + 200;
        let randomY = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(randomY);
        
        obstacleWidth = 180;
        obstacleHeight = myCanvas.height - randomY;
        
        let obstacle = new Building (obstacleX, randomY, obstacleWidth, obstacleHeight); 
        
        // push array
        currentGame.skyscrapers.push(obstacle);
        
      }
    }
    
    // next level
    if(newScore > 9){

      if(frames % 175 === 1){
        // create cop 
        randomCopY = Math.floor(Math.random() * 650);
        let currentCop = new Cop(randomCopY);
        currentGame.cops.push(currentCop);
      }
      
    }

    // iterate through the array of goodies; move cheeto left and draw
    for(let k = 0; k < currentGame.goodies.length; k++){

        currentGame.goodies[k].moveLeft();
      
        //////////////////////////detect collision/////////////////////////////////////
        const leafVertexX = currentLeaf.vertexXcoord();
        const leafVertexY = currentLeaf.vertexYcoord();
        const cheetoVertexX = currentGame.goodies[k].vertexXcoord();
        const cheetoVertexY = currentGame.goodies[k].vertexYcoord();
      
        let vertexWidth = Math.abs(leafVertexX - cheetoVertexX).toFixed(2);
        let vertexHeight = Math.abs(leafVertexY - cheetoVertexY).toFixed(2);
      
        function xCollision(){
          if(vertexWidth < ((.5 * currentLeaf.width) + (.5 * currentGame.goodies[k].width))){
         
            return true;
          }
          return false;
        }
      
        function yCollision(){
            
        if(vertexHeight < ((.5 * currentLeaf.height) + (.5 * currentGame.goodies[k].height))){
        
            return true;
          } 
          return false;
        }
      
        function collission(){

          if((xCollision()) && (yCollision())){
            console.log("CHEETOOOOOOOOS!!!!");
            addScore();
            currentGame.goodies.shift();
        
          }
        } 
      
        collission();
      
        /////////////////////////////////////////////////////////////////////////////////
        
        if(currentGame.goodies[k] !== undefined){

          currentGame.goodies[k].draw();
          if(currentGame.goodies[k].x + currentGame.goodies[k].width < 0){
            currentGame.goodies.shift();
          }

        }
      
    }  
	

    // iterate through the array of cops; move cop left and draw
    for(let k = 0; k < currentGame.cops.length; k++){

        currentGame.cops[k].moveLeft();
    
        //////////////////////////detect collision/////////////////////////////////////
        const leafVertexX = currentLeaf.vertexXcoord();
        const leafVertexY = currentLeaf.vertexYcoord();
        const copVertexX = currentGame.cops[k].vertexXcoord();
        const copVertxY = currentGame.cops[k].vertexYcoord();
    
        let vertexWidth = Math.abs(leafVertexX - copVertexX).toFixed(2);
        let vertexHeight = Math.abs(leafVertexY - copVertxY).toFixed(2);
    
        function xCollision(){
        if(vertexWidth < ((.5 * currentLeaf.width) + (.5 * currentGame.cops[k].width))){
         
          return true;
        }
        return false;
        }
    
        function yCollision(){
          
        if(vertexHeight < ((.5 * currentLeaf.height) + (.5 * currentGame.cops[k].height))){
         
          return true;
        } 
        return false;
        }
    
        function collission(){
          if((xCollision()) && (yCollision())){
       
            gameOver();
          }
        } 
    
        collission();
    
        /////////////////////////////////////////////////////////////////////////////////
    
        currentGame.cops[k].draw();
    
        if(currentGame.cops[k].x + currentGame.cops[k].width < 0){
        //addScore();
        currentGame.cops.shift();
        }
    }  

	
	
    
    // iterate through the array of skycrapers; move objects/skyscrapers left and draw
    for(let i = 0; i < currentGame.skyscrapers.length; i++){
      
      currentGame.skyscrapers[i].moveLeft();
      
      //////////////////////////detect collision///////////////////////////////////////
  
        const leafVertexX = currentLeaf.vertexXcoord();
        const leafVertexY = currentLeaf.vertexYcoord();
        const obstacleVertexX = currentGame.skyscrapers[i].vertexXcoord();
        const obstacleVertxY = currentGame.skyscrapers[i].vertexYcoord();
  
        let vertexWidth = Math.abs(leafVertexX - obstacleVertexX).toFixed(2);
        let vertexHeight = Math.abs(leafVertexY - obstacleVertxY).toFixed(2);

		
        function xCollision(){
          if(vertexWidth < ((.5 * currentLeaf.width) + (.5 * currentGame.skyscrapers[i].width))){
         
            return true;
          }
          return false;
        }
          
        function yCollision(){
          
          if(vertexHeight < ((.5 * currentLeaf.height) + (.5 * currentGame.skyscrapers[i].height))){
            
            return true;
          } 
          return false;
        }
        
        function collission(){
          if((xCollision()) && (yCollision())){
            console.log("BOOOOOOOOOM!!!!");
            gameOver();
          }
        } 

        collission();

      ////////////////////////////////////////////////////////////////////////////////

      currentGame.skyscrapers[i].draw();

      if(currentGame.skyscrapers[i].x + currentGame.skyscrapers[i].width < 0){

        currentGame.skyscrapers.shift();
      }
      
    }


    // iterate through the array of birds; move objects/birds left and draw
    for(let k = 0; k < currentGame.birds.length; k++){
		
      currentGame.birds[k].moveLeft();
	  
      //////////////////////////detect collision/////////////////////////////////////
      const leafVertexX = currentLeaf.vertexXcoord();
      const leafVertexY = currentLeaf.vertexYcoord();
      const birdVertexX = currentGame.birds[k].vertexXcoord();
      const birdVertxY = currentGame.birds[k].vertexYcoord();
	  
      let vertexWidth = Math.abs(leafVertexX - birdVertexX).toFixed(2);
      let vertexHeight = Math.abs(leafVertexY - birdVertxY).toFixed(2);
	  
      function xCollision(){
		  if(vertexWidth < ((.5 * currentLeaf.width) + (.5 * currentGame.birds[k].width))){
        
          return true;
        }
        return false;
      }
	  
      function yCollision(){
          
		  if(vertexHeight < ((.5 * currentLeaf.height) + (.5 * currentGame.birds[k].height))){
	
			  return true;
			} 
			return false;
		}
		
		function collission(){
			if((xCollision()) && (yCollision())){
				console.log("BOOOOOOOOOM!!!!");
          gameOver();
        }
      } 
	  
      collission();
	  
      /////////////////////////////////////////////////////////////////////////////////
	  
      currentGame.birds[k].draw();
	  
      if(currentGame.birds[k].x + currentGame.birds[k].width < 0){
		    //addScore();
        currentGame.birds.shift();
      }
      
    }  

    // win condition
    if(newScore > 25){
    youWin();
    }

// loop again
requestAnimationFrame(refresh);

}


// start the recursive function refresh()
refresh();


