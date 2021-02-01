
/*---root allows selection of css style variables
    Player.health = (--hp-1) shows the health bar 
    which is a variable set in CSS that
    can be changed with (root.style.setProperty('--hp-1', ' X%')
    Haven't figured out how to change the html hp display text 
    with changes of (--hp-1) yet tho.
--*/
let root = document.documentElement;









/////////////////////////////
//////  Timer ///////////////
/////////////////////////////
const TIME_LIMIT = 120
let timePassed = 0
let timeLeft = TIME_LIMIT
let timerInterval = null

document.querySelector('.actual-time').innerHTML = `
    <span id="base-timer-label" class="base-timer__label">
      ${formatTimeLeft(timeLeft)}
    </span>
  `
startTimer()


function onTimesUp() {
  clearInterval(timerInterval)
}
function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed
    document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft)
    if (timeLeft === 0) {
      onTimesUp();
    }
  }, 1000);
}

function formatTimeLeft(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

/////////////////////////////
//////Physics variables//////
/////////////////////////////

let friction = 0.8
let gravity = 0.3





/////////////////////////////
//////Images for game////////
/////////////////////////////


let floor = new Image;
floor.src = './images/Floor.jpg'







/////////////////////////////
//////Classes for game///////
/////////////////////////////

class Player{
    constructor(x,y,w,h,img){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.velX = 0
        this.velY = 0
        this.speed = 4
        this.jumping = false
        this.grounded = false
        this.img = img
        this.health = 100;
        this.special = getComputedStyle(root).getPropertyValue('--energy-1')
    }
    draw(ctx){
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
    jump(){
        this.velY = (-this.speed)*2;
        this.y += this.velY
    }
    update(ctx){
      //check collision
      if(!this.checkCollision())
      {
        this.velY = Math.min((gravity + this.velY),7);
        this.y += this.velY;
      }else {
        this.velY = 0;
      }
      
      this.draw(ctx)
    }
    checkCollision(){
      
      for(let object of gameObjects){
        
        if (this.x < object.x + object.w &&
          this.x + this.w > object.x &&
          this.y < object.y + object.h &&
          this.y + this.h > object.y) {
            this.grounded=true
           return true;
      }
    }
  }
    receiveDamageP1(){
      this.health -=10;
      document.querySelector('#hp-1').style.width = `${this.health}%`
    }
    receiveDamageP2(){
      this.health -=10;
      document.querySelector('#hp-2').style.width = `${this.health}%`
    }
    drawIdle(){

    }
    drawJump(){

    }
    drawSpecialAttack(){

    }
    drawAttack(){

    }
    drawRun(){

    }
    drawBlock(){

    }
}

class Barrier{
  constructor(x,y,w,h,img){
      this.x = x
      this.y = y
      this.w = w
      this.h = h
      this.img = img
  }
  draw(ctx){
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
  }

  update(ctx){
    this.draw(ctx)
  }
}

class CanvasDisplay {
  constructor() {
     this.canvas = document.querySelector('canvas');
     this.ctx = this.canvas.getContext('2d');
     this.stageConfig = {
      width: window.innerWidth,
      height: window.innerHeight *0.60,
     };         
     //create game objects to manipulate
     this.canvas.width = this.stageConfig.width;
     this.canvas.height = this.stageConfig.height;
     this.createFloor = new Barrier(0, this.stageConfig.height*0.9, this.stageConfig.width, 100, floor)
     this.createLeftWall = new Barrier(0, 0 , 20, this.stageConfig.height, floor)
     this.createRightWall = new Barrier(this.stageConfig.width*0.98, 0 , 30, this.stageConfig.height, floor)
     this.createPlatform = new Barrier(this.stageConfig.width*0.4, this.stageConfig.height*0.6 , 200, 50, floor)
     this.createPlayer1 = new Player(50,50,50,50, floor)
     this.createPlayer2 = new Player(400,50,50,50, floor)
    }
  
  animate() {
    //Update canvas
     this.ctx.clearRect(0, 0, this.stageConfig.width, this.stageConfig.height);
     this.createFloor.update(this.ctx)
     this.createLeftWall.update(this.ctx)
     this.createRightWall.update(this.ctx)
     this.createPlatform.update(this.ctx)
     this.createPlayer1.update(this.ctx)
     this.createPlayer2.update(this.ctx)
     //check collision
     //check death
  }
}

let canvasDisplay = new CanvasDisplay();

let player1 = canvasDisplay.createPlayer1
let player2 = canvasDisplay.createPlayer2

let gameObjects = [
  canvasDisplay.createPlatform,
  canvasDisplay.createFloor,
  canvasDisplay.createLeftWall,
  canvasDisplay.createRightWall
]



let interval = null

function playGame() {
  interval = requestAnimationFrame(playGame)
  canvasDisplay.animate()
}


window.onkeydown = function (e) {
  if (e.key === "ArrowLeft") {
      
  }
  if (e.key === "ArrowRight") {
      
  }
  if (e.key === "ArrowUp") {
      
  }
  if (e.key === "ArrowDown") {
      
  }
  if (e.key === " ") {
    player1.jump();
  }
}


playGame()