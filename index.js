window.addEventListener("click", function () {
  let splashTarget = document.querySelector(".splash-screen");
  let splashEffect = setInterval(function () {
    if (!splashTarget.style.opacity) {
      splashTarget.style.opacity = 1;
    }
    if (splashTarget.style.opacity > 0) {
      splashTarget.style.opacity -= 0.1;
    } else {
      clearInterval(splashTarget);
    }
  }, 100);
});

/* ---game over function that doesn't call fades out canvas and plays anims--- */
function gameOver() {
  if (player1.health <= 0 || player2.health <= 0) {
    playerDied++;

    let gameOver = document.querySelector("#evil-game-over");
    let bloodBg = document.querySelector("#blood-bg");
    let deadDog = document.querySelector("#dead-dog");
    let deadCat = document.querySelector("#dead-cat");
    let canvasContainer = document.querySelector(".container");
    canvasContainer.style.animation = "fade-out 1s 1.5s ease-in forwards";
    gameOver.style.animation =
      "fade-in 2s 2.5s ease-in forwards, game-drop .6s 5.6s forwards";
    bloodBg.style.animation = "fade-in 2.5s 2s ease forwards";
    if (player1.health <= 0) {
      deadDog.style.animation = "dog-drop 2s 4s ease-in forwards";
    } else {
      deadCat.style.animation = "dog-drop 2s 4s ease-in forwards";
    }
  }
}

/////////////////////////////
//////  Timer ///////////////
/////////////////////////////
const TIME_LIMIT = 120;
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;

document.querySelector(".actual-time").innerHTML = `
    <span id="base-timer-label" class="base-timer__label">
      ${formatTimeLeft(timeLeft)}
    </span>
  `;
startTimer();

function onTimesUp() {
  clearInterval(timerInterval);
}
function startTimer() {
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML = formatTimeLeft(
      timeLeft
    );
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

let friction = 0.8;
let gravity = 0.3;
keys = [];

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

let floor = new Image();
floor.src = "./PNG Objects/long-platform.png";

let platform2 = new Image();
platform2.src = "./PNG Objects/short-platform.png";

let catReverse = new Image();
catReverse.src = "./images/Cat-r.png";

let cat = new Image();
cat.src = "./images/Cat-l.png";

let dog = new Image();
dog.src = "./images/dog-l.png";

let dogReverse = new Image();
dogReverse.src = "./images/dog-r.png";

let bloodBoltR = new Image();
bloodBoltR.src = "./images/blood-blast-2.png";

let bloodBoltL = new Image();
bloodBoltL.src = "./images/blood-blast-l.png";

let blood = new Image();
blood.src = "./images/dropsplash.png";

let shield = new Image();
shield.src = "./images/explosion.png";

let attack = new Image();
attack.src = "./images/attack-1.png";

let tree = new Image();
tree.src = "./PNG Objects/tree.png";

let box = new Image();
box.src = "./PNG Objects/box.png";

let birds = new Image();
birds.src = "./PNG Objects/birds.png";

let shrooms = new Image();
shrooms.src = "./PNG Objects/mushrooms.png";

let flowers = new Image();
flowers.src = "./PNG Objects/flower.png";

let attackDrop = new Image();
attackDrop.src = "./images/attack-2.png";

/////////////////////////////
//////Audio for game////////
/////////////////////////////

let killSound = new Audio("./Audio/Kill Sound.mp3");
killSound.loop = false;
/////////////////////////////
//////Classes for game///////
/////////////////////////////
class SpecialEffects {
  constructor(player, w, h, img, numberWide, numberTall) {
    this.x = player.x;
    this.y = -1000;
    this.w = w;
    this.h = h;
    this.img = img;
    this.sx = 0;
    this.sy = 0;
    this.sw = img.width / numberWide;
    this.sh = img.height / numberTall;
    this.numberWide = numberWide;
    this.numberTall = numberTall;
  }
  update(ctx) {
    this.draw(ctx);
  }
  draw(ctx) {
    //animate blood
    if (this.img == blood) {
      if (frame % 8 == 0) {
        this.sx += this.sw;
      }
      if (this.sx > this.sw * 2 && this.sy == 0) {
        this.sx = 0;
        this.sy = this.sh;
      } else if (this.sx > this.sw * 2 && this.sy == this.sh) {
        this.y = -1000;
      }
    } else if (this.img == shield) {
      if (frame % 4 == 0) {
        this.sx += this.sw;
      }
      if (this.sx > this.sw * 6) {
        this.sx = this.sw * 4;
      }
    } else if ((this.img = attack)) {
      if (frame % 4 == 0) {
        this.sx += this.sw;
      }
      if (this.sx > this.sw) {
        this.sx = 0;
      }
    }

    //actually drawing
    ctx.drawImage(
      this.img,
      this.sx,
      this.sy,
      this.sw,
      this.sh,
      this.x,
      this.y,
      this.w,
      this.h
    );
  }
}
class Player {
  constructor(x, y, w, h, img, rImg, direction) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.velX = 0;
    this.velY = 0;
    this.speed = 5;
    this.jumping = false;
    this.grounded = false;
    this.img = img;
    this.rImg = rImg;
    this.sx = 0; //frame of animation
    this.sy = img.height / 5; //animation type
    this.sw = img.width / 10;
    this.sh = img.height / 5;
    this.numberTall = 5;
    this.numberWide = 10;
    this.health = 100;
    this.special = 0;
    this.keepLooping = true;
    this.direction = direction;
    this.blocking = false;
  }

  update(ctx) {
    this.draw(ctx);
    this.lowHealth();
  }
  draw(ctx) {
    //dead
    if (frame % 3 == 0 && this.special < 100) {
      this.special = this.special + 2;
      if (this.img == cat) {
        document.querySelector("#energy-1").style.width = `${this.special}%`;
      } else {
        document.querySelector("#energy-2").style.width = `${this.special}%`;
      }
    }

    if (this.sy == 0 && frame % 20 == 0) {
      this.sx += this.sw;
    }
    // Idle-foolishness
    // if (this.sy == this.sh*3 && frame % 10 == 0){
    //   this.sx += this.sw
    // }
    if (this.sy == this.sh * 4 && frame % 5 == 0) {
      this.sx += this.sw;
    }

    if (this.sx >= (this.numberWide - 1) * this.sw) {
      if (this.keepLooping) {
        this.sx = 0;
      } else {
        this.sx = (this.numberWide - 1) * this.sw;
      }
    }
    if (this.direction == "left") {
      ctx.drawImage(
        this.img,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.w,
        this.h
      );
    } else {
      ctx.drawImage(
        this.rImg,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }
  jump() {
    this.velY = -this.speed * 2;
    this.y = this.y + this.velY;
    this.fall();
  }
  dead() {
    this.numberWide = 10; //how many dead frames you have
    this.sy = 0;
    this.keepLooping = false;
  }
  fall() {
    this.numberWide = 8;
    this.sy = this.sh;
  }
  hurt() {
    this.numberWide = 10;
    this.sy = this.sh * 2;
  }
  idle() {
    this.numberWide = 10;
    this.sy = this.sh * 3;
  }
  run() {
    this.numberWide = 8;
    this.sy = this.sh * 4;
  }
  moveRight() {
    if (this.velX < 0) {
      this.velX = 0;
    }
    if (this.velX < this.speed) {
      this.velX = this.velX + 4;
    }
    this.x += this.velX;
    this.direction = "right";
  }
  moveLeft() {
    if (this.velX > 0) {
      this.velX = 0;
    }
    if (this.velX > -this.speed) {
      this.velX = this.velX - 4;
    }
    this.x += this.velX;
    this.direction = "left";
  }
  receiveDamageP1(multiplier) {
    if (this.blocking == false) {
      this.health -= 10 * multiplier;
      if (player2.direction == "right") {
        this.y -= this.h * 1;
        this.x += this.w;
      } else {
        this.y -= this.h * 1;
        this.x -= this.w;
      }
    } else {
      this.health -= 2 * multiplier;
    }
    bloodP1.sx = 0;
    bloodP1.sy = 0;
    bloodP1.y = this.y;
    bloodP1.x = this.x;
    if (this.health < 50) {
      document.querySelector(
        "#hp-1"
      ).style.cssText = `width: ${this.health}%; background-image: linear-gradient(#ff0404, #ec4141, #f16a63,  #ec4141, #ff0404)`;
      document.querySelector(".player1").style.cssText =
        "animation: healthGlow 2s infinite;";
    }
    document.querySelector("#hp-1").style.width = `${this.health}%`;
  }
  receiveDamageP2(multiplier) {
    if (this.blocking == false) {
      this.health -= 10 * multiplier;
      if (player1.direction == "right") {
        this.y -= this.h * 1;
        this.x -= this.w;
      } else {
        this.y -= this.h * 1;
        this.x -= this.w;
      }
    } else {
      this.health -= 2 * multiplier;
    }

    bloodP2.sx = 0;
    bloodP2.sy = 0;
    bloodP2.y = this.y;
    bloodP2.x = this.x;
    if (this.health < 50) {
      document.querySelector(
        "#hp-2"
      ).style.cssText = `width: ${this.health}%; background-image: linear-gradient(#ff0404, #ec4141, #f16a63,  #ec4141, #ff0404)`;
      document.querySelector(".player2").style.cssText =
        "animation: healthGlow 2s infinite;";
    }
    document.querySelector("#hp-2").style.width = `${this.health}%`;
  }
  drawBlockP1() {
    shieldP1.sx = shieldP1.sw * 4;
    shieldP1.sy = 0;
    shieldP1.y = this.y - this.h * 1.5;
    shieldP1.x = this.x - this.w * 1.2;
    this.blocking = true;
  }
  drawBlockP2() {
    shieldP2.sx = shieldP2.sw * 4;
    shieldP2.sy = 0;
    shieldP2.y = this.y - this.h * 1.5;
    shieldP2.x = this.x - this.w * 1.05;
    this.blocking = true;
  }
  lowHealth() {
    if (this.health <= 40) {
      let lowHealthDarkBg = document.querySelector("#low-health-bg");
      lowHealthDarkBg.style.animation = "fade-in 1.5s ease-in forwards";
    }
  }
}

class SpecialAttack {
  constructor(x, y, w, h, img, img2) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.img2 = img2;
    this.sx = 0;
    this.sy = 0;
    this.sw = img.width / 5;
    this.sh = img.height;
    this.direction = null;
  }
  update(ctx) {
    this.drawAttack(ctx);
  }
  drawAttack(ctx) {
    if (frame % 5 == 0) {
      this.sx += this.sw;
    }
    if (this.sx > this.sw * 4) {
      this.sx = 0;
    }
    if (this.direction == "right") {
      this.x += 8;
    } else {
      this.x -= 8;
    }
    if (this.direction == "right") {
      ctx.drawImage(
        this.img,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.w,
        this.h
      );
    } else {
      ctx.drawImage(
        this.img2,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.w,
        this.h
      );
    }
  }
  reset(player) {
    this.direction = player.direction;
    if (this.direction == "right") {
      this.x = player.x + player.w;
    } else {
      this.x = player.x - player.w;
    }
    this.y = player.y;
  }
}

class Beautify {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }
  update(ctx) {
    this.draw(ctx);
  }
  reset(player) {
    this.direction = player.direction;
    if (this.direction == "right") {
      this.x = player.x + player.w * 0.5;
    } else {
      this.x = player.x - player.w * 0.5;
    }
    this.y = player.y;
  }
}

class Barrier {
  constructor(x, y, w, h, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
  }
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
  }

  update(ctx) {
    this.draw(ctx);
  }
}

class CanvasDisplay {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.stageConfig = {
      width: 1000,
      height: 500,
    };
    //create game objects to manipulate
    this.canvas.width = this.stageConfig.width;
    this.canvas.height = this.stageConfig.height;

    this.createFloor = new Barrier(
      -100,
      this.stageConfig.height * 0.9,
      this.stageConfig.width * 1.2,
      50,
      floor
    );
    this.createLeftWall = new Barrier(
      -800,
      0,
      800,
      this.stageConfig.height,
      floor
    );
    this.createRightWall = new Barrier(
      1000,
      0,
      800,
      this.stageConfig.height,
      floor
    );
    this.createPlatform = new Barrier(
      this.stageConfig.width * 0.4,
      this.stageConfig.height * 0.6,
      200,
      50,
      platform2
    );
    this.createPlayer1 = new Player(50, 50, 100, 100, dog, dogReverse, "right");
    this.createPlayer2 = new Player(825, 50, 100, 100, cat, catReverse, "left");
    this.createSpecialP1 = new SpecialAttack(
      2000,
      2000,
      100,
      100,
      bloodBoltR,
      bloodBoltL
    );
    this.createSpecialP2 = new SpecialAttack(
      2500,
      2000,
      100,
      100,
      bloodBoltR,
      bloodBoltL
    );
    this.createBloodP1 = new SpecialEffects(
      this.createPlayer1,
      100,
      100,
      blood,
      3,
      2
    );
    this.createBloodP2 = new SpecialEffects(
      this.createPlayer2,
      100,
      100,
      blood,
      3,
      2
    );
    this.createShieldP1 = new SpecialEffects(
      this.createPlayer1,
      250,
      350,
      shield,
      17,
      1
    );
    this.createShieldP2 = new SpecialEffects(
      this.createPlayer2,
      250,
      350,
      shield,
      17,
      1
    );
    this.createAttackP1 = new SpecialEffects(
      this.createPlayer1,
      50,
      50,
      attack,
      2,
      1
    );
    this.createAttackP2 = new SpecialEffects(
      this.createPlayer2,
      50,
      50,
      attack,
      2,
      1
    );
    this.createTree = new Beautify(-2, 255, 200, 200, tree);
    this.createTree2 = new Beautify(800, 255, 200, 200, tree);
    this.createBox = new Beautify(400, 250, 50, 50, box);
    this.createBirds = new Beautify(900, 55, 100, 100, birds);
    this.createShrooms = new Beautify(400, 410, 50, 50, shrooms);
    this.createFlowers = new Beautify(920, 405, 50, 50, flowers);
    this.createFlowers2 = new Beautify(200, 405, 50, 50, flowers);
    this.createAttackDropP1 = new Beautify(
      this.createAttackP1.x,
      this.createAttackP1.y,
      100,
      100,
      attackDrop
    );
    this.createAttackDropP2 = new Beautify(
      this.createAttackP2.x,
      this.createAttackP2.y,
      100,
      100,
      attackDrop
    );
  }

  animate() {
    //Update canvas
    this.ctx.clearRect(0, 0, this.stageConfig.width, this.stageConfig.height);
    //Beautify stuffff
    this.createTree.update(this.ctx);
    this.createTree2.update(this.ctx);
    this.createBox.update(this.ctx);
    this.createBirds.update(this.ctx);
    this.createShrooms.update(this.ctx);
    this.createFlowers.update(this.ctx);
    this.createFlowers2.update(this.ctx);
    //End stuffff
    this.createFloor.update(this.ctx);
    this.createLeftWall.update(this.ctx);
    this.createRightWall.update(this.ctx);
    this.createPlatform.update(this.ctx);
    this.createPlayer1.update(this.ctx);
    this.createPlayer2.update(this.ctx);
    this.createSpecialP1.update(this.ctx);
    this.createSpecialP2.update(this.ctx);
    this.createBloodP1.update(this.ctx);
    this.createBloodP2.update(this.ctx);
    this.createShieldP1.update(this.ctx);
    this.createShieldP2.update(this.ctx);
    this.createAttackP1.update(this.ctx);
    this.createAttackP2.update(this.ctx);
    this.createAttackDropP1.update(this.ctx);
    this.createAttackDropP2.update(this.ctx);

    //check collision
    //check death
  }
}

let canvasDisplay = new CanvasDisplay();

/////////////////////////////
//Global pointers to objects/
/////////////////////////////

let ctx = canvasDisplay.ctx;
let player1 = canvasDisplay.createPlayer1;
let player2 = canvasDisplay.createPlayer2;
let specialP1 = canvasDisplay.createSpecialP1;
let specialP2 = canvasDisplay.createSpecialP2;
let bloodP1 = canvasDisplay.createBloodP1;
let bloodP2 = canvasDisplay.createBloodP2;
let shieldP1 = canvasDisplay.createShieldP1;
let shieldP2 = canvasDisplay.createShieldP2;
let attackP1 = canvasDisplay.createAttackP1;
let attackP2 = canvasDisplay.createAttackP2;
let attackDropP1 = canvasDisplay.createAttackDropP1;
let attackDropP2 = canvasDisplay.createAttackDropP2;

let platform = canvasDisplay.createPlatform;
let stage = canvasDisplay.createFloor;
let leftWall = canvasDisplay.createLeftWall;
let rightWall = canvasDisplay.createRightWall;

let gameObjects = [
  canvasDisplay.createPlatform,
  canvasDisplay.createFloor,
  canvasDisplay.createLeftWall,
  canvasDisplay.createRightWall,
  canvasDisplay.createSpecialP1,
  canvasDisplay.createSpecialP2,
  canvasDisplay.createAttackP1,
  canvasDisplay.createAttackP2,
];

//collision check

function colCheck(shapeA, shapeB) {
  // get the vectors to check against
  var vX = shapeA.x + shapeA.w / 2 - (shapeB.x + shapeB.w / 2),
    vY = shapeA.y + shapeA.h / 2 - (shapeB.y + shapeB.h / 2),
    // add the half widths and half heights of the objects
    hWidths = shapeA.w / 2 + shapeB.w / 2,
    hHeights = shapeA.h / 2 + shapeB.h / 2,
    colDir = null;

  // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
  if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
    // figures out on which side we are colliding (top, bottom, left, or right)
    var oX = hWidths - Math.abs(vX),
      oY = hHeights - Math.abs(vY);
    if (shapeB == attackP1 || shapeB == attackP2) {
      colDir = "a";
    } else {
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
}
let timeToDissapear = 100;
let timeToDissapear1 = 100;
let interval = null;
let frame = 0;
let playerDied = 0;
function playGame() {
  /*--- key press codes, if true which is set on keydown, will check to see if player1 is within canvas, 
        then execute move functions in class--- */
  if (playerDied == 1) {
    killSound.play();
    playerDied++;
  }
  if (keys[17] && player2.special == 100) {
    //special attack
    specialP1.reset(player1);
    player2.special = 0;
  }

  if (keys[16] && player2.special > 25) {
    //attack
    player2.special -= 25;
    if (player1.direction == "right") {
      attackP1.y = player1.y + player1.h / 4;
      attackP1.x = player1.x + player1.w * 0.8;
    } else {
      attackP1.y = player1.y + player1.h / 4;
      attackP1.x = player1.x - player1.w * 0.4;
    }
    timeToDissapear1 = 100;
    attackDropP1.reset(player1);
  } else {
    timeToDissapear1 -= 4;
    if (timeToDissapear1 == 0) {
      attackDropP1.y = -1000;
      timeToDissapear1 = 100;
    }
    attackP1.y = -1000;
  }
  if (keys[37]) {
    leftkey.style.animation = "buttonGlow 5s alternate-reverse";
    if (player1.x - 30 > 0) {
      player1.moveLeft();
    }
  }
  if (keys[39]) {
    rightkey.style.animation = "buttonGlow 5s alternate-reverse";
    if (player1.x < 1365) {
      player1.moveRight();
    }
  }
  if (keys[38]) {
    upkey.style.animation = "buttonGlow 5s alternate-reverse";
    if (player1.y - player1.h > 0) {
      if (!player1.jumping && player1.grounded) {
        player1.grounded = false;
        player1.jump();
      }
    }
  }
  if (keys[40] && player2.special > 10) {
    downkey.style.animation = "buttonGlow 5s alternate-reverse";
    shieldP1.x = player1.x;
    shieldP1.y = player1.y;
    player1.drawBlockP1();
    player1.blocking = true;
    player2.special -= 2;
  } else {
    shieldP1.y = -1000;
    player1.blocking = false;
  }

  //PLAYER2
  if ((keys[81] || keys[88]) && player1.special == 100) {
    specialP2.reset(player2);
    player1.special = 0;
    console.log("i pressed it!");
  }
  if (keys[69] && player1.special > 25) {
    player1.special -= 25;
    //attack
    if (player2.direction == "right") {
      attackP2.y = player2.y + player2.h / 4;
      attackP2.x = player2.x + player2.w * 0.8;
    } else {
      attackP2.y = player2.y + player2.h / 4;
      attackP2.x = player2.x - player2.w * 0.4;
    }
    timeToDissapear = 100;
    attackDropP2.reset(player2);
  } else {
    timeToDissapear -= 4;
    if (timeToDissapear == 0) {
      attackDropP2.y = -1000;
      timeToDissapear = 100;
    }
    attackP2.y = -1000;
  }

  player1.velY += gravity;
  player1.velX *= friction;
  player1.grounded = false;

  if (keys[65]) {
    aakey.style.animation = "buttonGlow 5s alternate-reverse";
    player2.moveLeft();
  }
  if (keys[68]) {
    ddkey.style.animation = "buttonGlow 5s alternate-reverse";
    player2.moveRight();
  }
  if (keys[87]) {
    wwkey.style.animation = "buttonGlow 5s alternate-reverse";
    if (!player2.jumping && player2.grounded) {
      player2.grounded = false;
      player2.jump();
    }
  }
  if (keys[83] && player1.special > 10) {
    sskey.style.animation = "buttonGlow 5s alternate-reverse";
    player2.drawBlockP2();
    player2.blocking = true;
    player1.special -= 2;
  } else {
    shieldP2.y = -1000;
    player2.blocking = false;
  }

  player2.velY += gravity;
  player2.velX *= friction;
  player2.grounded = false;

  for (var i = 0; i < gameObjects.length; i++) {
    var dir = colCheck(player1, gameObjects[i]);

    if (i < 4) {
      if (dir === "l" || dir === "r") {
        player1.velX = 0;
        player1.jumping = false;
      } else if (dir === "b") {
        player1.grounded = true;
        player1.jumping = false;
      } else if (dir === "t") {
        player1.velY *= -1;
      }
    } else if (i == 5) {
      if (dir != null) {
        player1.receiveDamageP1(3);
        specialP2.y = -500;
      }
    } else if (i == 7) {
      if (dir != null) {
        player1.receiveDamageP1(1);
      }
    }
  }

  if (player1.grounded) {
    player1.velY = 0;
    player1.idle();
  }

  player1.x += player1.velX;
  player1.y += player1.velY;

  for (var i = 0; i < gameObjects.length; i++) {
    var dir = colCheck(player2, gameObjects[i]);
    if (i < 4) {
      if (dir === "l" || dir === "r") {
        player2.velX = 0;
        player2.jumping = false;
      } else if (dir === "b") {
        player2.grounded = true;
        player2.jumping = false;
      } else if (dir === "t") {
        player2.velY *= -1;
      }
    } else if (i == 4) {
      if (dir != null) {
        player2.receiveDamageP2(3);
        specialP1.y = -500;
      }
    } else if (i == 6) {
      if (dir != null) {
        player2.receiveDamageP2(1);
      }
    }
  }

  if (player2.grounded) {
    player2.velY = 0;
    player2.idle();
  }

  player2.x += player2.velX;
  player2.y += player2.velY;

  if (player1.health <= 0) {
    player1.dead();
  }
  if (player2.health <= 0) {
    player2.dead();
  }
  if ((player1.velX > 0.3 || player1.velX < -0.3) && player1.grounded) {
    player1.run();
  }
  if ((player2.velX > 0.3 || player2.velX < -0.3) && player2.grounded) {
    player2.run();
  }
  // if (player1.grounded == false) {
  //   player1.fall()
  // }
  // if (player2.grounded == false) {
  //   player2.fall()
  // }

  // player1.x
  // player2.x

  // ---- DON't KNOW IF THIS frame++ IS SUPPOSED TO BE HERE ROBERTO--- //
  frame++;
  gameOver();
  interval = requestAnimationFrame(playGame);
  canvasDisplay.animate();
}

// ---listeners for key down and up--- //
// ---added selectors for key IDs to animate in HUD--- //
let leftkey = document.querySelector("#leftkey");
let rightkey = document.querySelector("#rightkey");
let upkey = document.querySelector("#upkey");
let downkey = document.querySelector("#downkey");
let aakey = document.querySelector("#aakey");
let ddkey = document.querySelector("#ddkey");
let wwkey = document.querySelector("#wwkey");
let sskey = document.querySelector("#sskey");

window.onkeydown = function (e) {
  keys[e.keyCode] = true;
};

// ---cancels animations added to keys upon key up--- //
window.onkeyup = function (e) {
  keys[e.keyCode] = false;
  document.querySelector("#leftkey").style.removeProperty("animation");
  document.querySelector("#rightkey").style.removeProperty("animation");
  document.querySelector("#upkey").style.removeProperty("animation");
  document.querySelector("#downkey").style.removeProperty("animation");
  document.querySelector("#aakey").style.removeProperty("animation");
  document.querySelector("#ddkey").style.removeProperty("animation");
  document.querySelector("#wwkey").style.removeProperty("animation");
  document.querySelector("#sskey").style.removeProperty("animation");
};

playGame();
