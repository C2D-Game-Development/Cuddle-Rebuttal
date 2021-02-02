

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
//Global pointers to objects/
/////////////////////////////

/////////////////////////////
//////Physics variables//////
/////////////////////////////

let friction = 0.8
let gravity = 0.2
keys = []



/////////////////////////////
//////Images for game////////
/////////////////////////////


let floor = new Image;
floor.src = './images/Floor.jpg'

let dog = new Image;
dog.src = './images/Dog.png'





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
        this.speed = 6
        this.jumping = false
        this.grounded = false
        this.img = img
        this.sx = 0 //frame of animation
        this.sy = 0 //animation type
        this.sw = img.width/10 
        this.sh = img.height/5
        this.numberTall = 5
        this.numberWide = 10
        this.health = 100;
        this.special = 0;
    }
 
  update(ctx) {
    //check collision
    if(!this.checkCollision())
    {
     this.velY += gravity;
      this.y += this.velY;
    }else {
      this.velY = 0;
    }
    
    this.draw(ctx)
  }
    draw(ctx){
      this.sx += this.sw;
      if (this.sx>=(this.numberWide-1)*this.sw)
      {
        this.sx=0;
      }
      ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h,)
    }
    jump(){
        this.velY = (-this.speed)*2;
        this.y = this.y + this.velY
        this.fall();
    }
    dead() {
      this.numberWide = 10
      this.sy = 0
    }
    fall() {
      this.numberWide = 8
      this.sy = this.sh
    }
    hurt() {
      this.numberWide = 10
      this.sy = this.sh * 2
    }
    idle() {
      this.numberWide = 10
      this.sy = this.sh * 3
    }
    run() {
      this.numberWide = 8
      this.sy = this.sh * 4
    }
    moveRight(){
      if (this.velX<0)
      {
        this.velX=0;
      }
      if (this.velX < this.speed) {
        this.velX = this.velX + 4;
      }
      this.x += this.velX
    }
    moveLeft(){
      if (this.velX>0)
      {
        this.velX=0;
      }
      if (this.velX > -this.speed) {
        this.velX = this.velX - 4;
      }
      this.x += this.velX
    }
  
    checkCollision(){
      
      for(let object of gameObjects){
        
        if (this.x < object.x + object.w &&
          this.x + this.w > object.x &&
          this.y < object.y + object.h &&
          this.y + this.h > object.y) {
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
      width: 1000,
      height: 500
     };          
     //create game objects to manipulate
     this.canvas.width = this.stageConfig.width;
     this.canvas.height = this.stageConfig.height;
     this.createFloor = new Barrier(0, this.stageConfig.height*0.9, this.stageConfig.width, 100, floor)
     this.createLeftWall = new Barrier(0, 0 , 20, this.stageConfig.height, floor)
     this.createRightWall = new Barrier(this.stageConfig.width*0.98, 0 , 30, this.stageConfig.height, floor)
     this.createPlatform = new Barrier(this.stageConfig.width*0.4, this.stageConfig.height*0.6 , 200, 50, floor)
     this.createPlayer1 = new Player(50,50,100,100, dog)
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
  /*--- key press codes, if true which is set on keydown, will check to see if player1 is within canvas, 
        then execute move functions in class--- */
  if (keys[37] || keys[65]) {
    if((player1.x - 30) > 0) {
      player1.moveLeft()
    }
  }
  if (keys[39] || keys[68]) {
    if(player1.x < 1365) {
      player1.moveRight()
    }
  }
  if (keys[38] || keys[32] || keys[87]) {
    if((player1.y - player1.h) > 0) {
      if(!player1.jumping && player1.grounded){
        player1.grounded = false
        player1.jump()
      }
    }
  }
  player1.velY += gravity;
  player1.grounded = false

  interval = requestAnimationFrame(playGame)
  canvasDisplay.animate() 
}

// ---listeners for key down and up--- //
window.onkeydown = function(e) {
  keys[e.keyCode] = true
}
window.onkeyup = function(e) {
  keys[e.keyCode] = false

}


playGame()