window.addEventListener("click", function() {
  let splashTarget = document.querySelector('#splash-screen')
  let splashEffect = setInterval(function() {
    if (!splashTarget.style.opacity) {
      splashTarget.style.opacity = 1;
    }
    if (splashTarget.style.opacity > 0) {
      splashTarget.style.opacity -= 0.1;
    }
    else {
      clearInterval(splashTarget)
    }
  }, 100)
})


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
keys = []



// function computerLogic()
// {
//     if(player1.x<player2.x)
//     {
//         player2.moveLeft()
//     }
//     if(player1.x>player2.x)
//     {   
//         player2.moveRight()
//     }
// }



/////////////////////////////
//////Images for game////////
/////////////////////////////


let floor = new Image;
floor.src = './images/floor.jpg'

let catReverse = new Image;
catReverse.src = './images/Cat-r.png'

let cat = new Image;
cat.src = './images/Cat-l.png'

let dog = new Image;
dog.src = './images/dog-l.png'

let dogReverse = new Image;
dogReverse.src = './images/dog-r.png'

let bloodBoltR = new Image;
bloodBoltR.src = './images/blood-blast-2.png'

let bloodBoltL = new Image;
bloodBoltL.src = './images/blood-blast-l.png'

let blood = new Image;
blood.src = './images/dropsplash.png'

/////////////////////////////
//////Classes for game///////
/////////////////////////////
class Blood{
    constructor(player,w,h,img){
      this.x=player.x
      this.y=player.y
      this.w=w
      this.h=h
      this.img=img
      this.sx=0
      this.sy=0
      this.sw=img.width/3
      this.sh=img.height/2
    }
    update(ctx)
    {
      this.draw(ctx)
    }
    draw(ctx)
    {
      ctx.drawImage(this.img,this.sx,this.sy,this.sw,this.sh,this.x,this.y,this.w,this.h)
    }
}
class Player{
    constructor(x,y,w,h,img,rImg,direction){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.velX = 0
        this.velY = 0
        this.speed = 5
        this.jumping = false
        this.grounded = false
        this.img = img
        this.rImg = rImg
        this.sx = 0 //frame of animation
        this.sy = img.height/5 //animation type
        this.sw = img.width/10 
        this.sh = img.height/5
        this.numberTall = 5
        this.numberWide = 10
        this.health = 100;
        this.special = 0;
        this.keepLooping = true
        this.direction = direction
    }
 
  update(ctx) {
    
    this.draw(ctx)
    this.lowHealth()
  }
    draw(ctx){
      //dead
      if(frame % 3 ==0 && this.special<100)
      {
        this.special++
        if(this.img==cat)
        {
        document.querySelector('#energy-1').style.width = `${this.special}%`
        }else{
        document.querySelector('#energy-2').style.width = `${this.special}%`
        }
      }
      
      if (this.sy == 0 && frame % 20 == 0) {
        this.sx += this.sw 
      }
      // Idle-foolishness
      // if (this.sy == this.sh*3 && frame % 10 == 0){
      //   this.sx += this.sw
      // }
      if (this.sy == this.sh*4 && frame % 5 == 0) {
        this.sx += this.sw
      }

      if (this.sx>=(this.numberWide-1)*this.sw)
      {
        if(this.keepLooping) {
          this.sx=0;

        } else {
          this.sx = (this.numberWide -1)* this.sw
        }
        
      }
      if(this.direction=='left'){
        ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h)
      }else{
      ctx.drawImage(this.rImg, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h)
      }
    }
    jump(){
        this.velY = (-this.speed)*2;
        this.y = this.y + this.velY
        this.fall();
    }
    dead() {
      this.numberWide = 10//how many dead frames you have
      this.sy = 0
      this.keepLooping = false
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
      this.direction = 'right'
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
      this.direction ='left'
    }
    receiveDamageP1(){
      this.health -=10;
      if(this.health < 50) {
        document.querySelector('#hp-1').style.cssText = `width: ${this.health}%; background-image: linear-gradient(#ff0404, #ec4141, #f16a63,  #ec4141, #ff0404)`
        document.querySelector('.player1').style.cssText = "animation: healthGlow 2s infinite;"
      }
      document.querySelector('#hp-1').style.width = `${this.health}%`
    }
    receiveDamageP2(){
      this.health -=10;
      if(this.health < 50) {
        document.querySelector('#hp-2').style.cssText = `width: ${this.health}%; background-image: linear-gradient(#ff0404, #ec4141, #f16a63,  #ec4141, #ff0404)`
        document.querySelector('.player2').style.cssText = "animation: healthGlow 2s infinite;"
      }
      document.querySelector('#hp-2').style.width = `${this.health}%`
    }
    drawRun(){

    }
    drawBlock(){

    }
    lowHealth() {
      if (this.health <= 40) {
        document.querySelector('body').style.background = getBodyValue
        document.querySelector('body').style.backgroundSize = "cover"
      }
      if (this.health <= 20) {
        document.querySelector('body').style.background = getBodyValue1
        document.querySelector('body').style.backgroundSize = "cover"
      }
    }
}

class SpecialAttack {
  constructor(x, y, w, h, img, img2) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.img = img
    this.img2 = img2
    this.sx = 0
    this.sy = 0
    this.sw = img.width / 5
    this.sh = img.height
    this.direction = null
  }
  update(ctx) {
    this.drawAttack(ctx)
  }
  drawAttack(ctx) {
    if (frame % 5 == 0) {
      this.sx += this.sw
    }
    if (this.sx > this.sw * 4) {
      this.sx = 0
    }
    if(this.direction=='right'){
    this.x += 5
    }else{
      this.x-=5
    }
    if(this.direction=='right'){
    ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h)
    }else {
      ctx.drawImage(this.img2, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.w, this.h)
    }
  }
  reset(player) {
    this.direction=player.direction
    if(this.direction=='right'){
    this.x = player.x + player.w
    
    }else{
      this.x= player.x - player.w
    }
    this.y = player.y
    
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
     this.createPlayer1 = new Player(50,50,100,100, dog, dogReverse, 'right')
     this.createPlayer2 = new Player(825,50,100,100, cat, catReverse, 'left')
     this.createSpecialP1 = new SpecialAttack(2000, 2000, 100, 100, bloodBoltR, bloodBoltL)
     this.createSpecialP2 = new SpecialAttack(2500, 2000, 100, 100, bloodBoltR, bloodBoltL )
     this.createBloodP1 = new Blood(this.createPlayer1,100,100,blood)
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
     this.createSpecialP1.update(this.ctx)
     this.createSpecialP2.update(this.ctx)
     this.createBloodP1.update(this.ctx)
     //check collision
     //check death
  }
}

let canvasDisplay = new CanvasDisplay();

/////////////////////////////
//Global pointers to objects/
/////////////////////////////

let ctx = canvasDisplay.ctx
let player1 = canvasDisplay.createPlayer1
let player2 = canvasDisplay.createPlayer2
let specialP1 = canvasDisplay.createSpecialP1
let specialP2 = canvasDisplay.createSpecialP2

 let platform =  canvasDisplay.createPlatform
 let stage =     canvasDisplay.createFloor
 let leftWall =  canvasDisplay.createLeftWall
 let rightWall = canvasDisplay.createRightWall

let gameObjects = [
  canvasDisplay.createPlatform,
  canvasDisplay.createFloor,
  canvasDisplay.createLeftWall,
  canvasDisplay.createRightWall,
  canvasDisplay.createSpecialP1,
  canvasDisplay.createSpecialP2
]

//collision check

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = (shapeA.x + (shapeA.w / 2)) - (shapeB.x + (shapeB.w / 2)),
      vY = (shapeA.y + (shapeA.h / 2)) - (shapeB.y + (shapeB.h / 2)),
      // add the half widths and half heights of the objects
      hWidths = (shapeA.w / 2) + (shapeB.w / 2),
      hHeights = (shapeA.h / 2) + (shapeB.h / 2),
      colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
      // figures out on which side we are colliding (top, bottom, left, or right)
      var oX = hWidths - Math.abs(vX),
          oY = hHeights - Math.abs(vY);
      if (oX >= oY) {
          if (vY > 0) {
              colDir = "t";
              shapeA.y += oY;
          } else {
              colDir = "b";
              shapeA.y -= oY;
          }
      } else {
          if (vX > 0) {
              colDir = "l";
              shapeA.x += oX;
          } else {
              colDir = "r";
              shapeA.x -= oX;
          }
      }
  }
  return colDir;
}

let interval = null
let frame = 0

function playGame() {
  /*--- key press codes, if true which is set on keydown, will check to see if player1 is within canvas, 
        then execute move functions in class--- */
  if (keys[17] && player2.special==100) 
        {
          specialP1.reset(player1)
          player2.special=0
        }
  if (keys[37]) {
    if((player1.x - 30) > 0) {
      player1.moveLeft()
    }
  }
  if (keys[39]) {
    if(player1.x < 1365) {
      player1.moveRight()
    }
  }
  if (keys[38]) {
    if((player1.y - player1.h) > 0) {
      if(!player1.jumping && player1.grounded){
        player1.grounded = false
        player1.jump()
      }
    }
  }
  if ((keys[81] || keys[88]) && player1.special==100) {
    specialP2.reset(player2)
    player1.special=0
    console.log("i pressed it!")
  }
  player1.velY += gravity;
  player1.velX *= friction;
  player1.grounded = false

  if (keys[65]) {
   player2.moveLeft()
    }
  if (keys[68]) {
      player2.moveRight()
  }
  if (keys[87]) {
      if(!player2.jumping && player2.grounded){
        player2.grounded = false
        player2.jump()
      }
  }
  player2.velY += gravity;
  player2.velX *= friction;
  player2.grounded = false


  for (var i = 0; i < gameObjects.length; i++) {
    
    var dir = colCheck(player1, gameObjects[i]);

    if(i<4){
    if (dir === "l" || dir === "r") {
        player1.velX = 0;
        player1.jumping = false;
    } else if (dir === "b") {
        player1.grounded = true;
        player1.jumping = false;
    } else if (dir === "t") {
        player1.velY *= -1;
    }
  }else{
    if(dir!=null){
      player1.receiveDamageP1()
      specialP2.y=-500;
    }
  }
}

if(player1.grounded){
     player1.velY = 0;
     player1.idle()
}

player1.x += player1.velX;
player1.y += player1.velY;



for (var i = 0; i < gameObjects.length; i++) {
    
  var dir = colCheck(player2, gameObjects[i]);
  if(i<4){
  if (dir === "l" || dir === "r") {
      player2.velX = 0;
      player2.jumping = false;
  } else if (dir === "b") {
      player2.grounded = true;
      player2.jumping = false;
  } else if (dir === "t") {
      player2.velY *= -1;
  }}else{
    if(dir!=null){
      player2.receiveDamageP2()
      specialP1.y=-500;
    }
  }
  
}

if(player2.grounded){
  player2.velY = 0;
  player2.idle()
}

player2.x += player2.velX;
player2.y += player2.velY;

if (player1.health <= 0) {
  player1.dead()
}
if (player2.health <= 0) {
  player2.dead()
}
if ((player1.velX > 0.3 || player1.velX < -0.3)&&player1.grounded) {
  player1.run()
}
if ((player2.velX > 0.3 || player2.velX < -0.3)&&player2.grounded) {
  player2.run()
}
// if (player1.grounded == false) {
//   player1.fall()
// }
// if (player2.grounded == false) {
//   player2.fall()
// }

// player1.x 
// player2.x

frame++
  
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
// ---dom selectors for healthbar image changes--- //
let getBody = document.querySelector('body')
let getBodyCss = window.getComputedStyle(getBody)
let getBodySize = getBodyCss.getPropertyValue('background-size')
let getBodyValue = getBodyCss.getPropertyValue('background')
getBodyValue = "url(images/c2d-background-dark.jpg) no-repeat center center fixed"
getBodyValue1 = "url(images/c2d-background-blood.png) no-repeat center center fixed"


playGame()
