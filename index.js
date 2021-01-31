let canvas = document.querySelector('canvas')
/*---root allows selection of css style variables
    Player.health = (--hp-1) shows the health bar 
    which is a variable set in CSS that
    can be changed with (root.style.setProperty('--hp-1', ' X%')
    Haven't figured out how to change the html hp display text 
    with changes of (--hp-1) yet tho.
--*/
let root = document.documentElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight *0.60;
let ctx = canvas.getContext('2d')


class Player{
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.health = getComputedStyle(root).getPropertyValue('--hp-1')
        this.special = getComputedStyle(root).getPropertyValue('--energy-1')
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
let playa = new Player(50, 50, 50, 50)
class Barrier{
    constructor(x,y,w,h,img){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.img=img
    }
    drawBarrier(){
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h)
    }
}
ctx.clearRect(0,0,canvas.width,canvas.height)
let floorImg = new Image()
floorImg.src= './images/Floor.jpg'
let floor = new Barrier(0,0,800, 100, floorImg)

floor.drawBarrier();


// //Arena barriers and platforms
// let barriers = [
//     floor
// ]

/*  */

// //platforms
// var platforms = [];
// var platThickness = 10;

// for (var k = 0; k < platforms.length; k++) {
//     ctx.rect(platforms[k].x, platforms[k].y, platforms[k].width, platforms[k].height);

// // left wall
// platforms.push({
//     x: 0,
//     y: 0,
//     width: 10,
//     height: height
// });
// // right wall
// platforms.push({
//     x: width - 10,
//     y: 0,
//     width: 10,
//     height: height
// });
// // floor
// platforms.push({
//     x: 0,
//     y: height - 10,
//     width: width,
//     height: 50
// });
// // ceiling
// platforms.push({
//     x: 0,
//     y: 0,
//     width: width,
//     height: platThickness
// });
// // platforms
// platforms.push({
//     x: 0,
//     y: height - 140,
//     width: 180,
//     height: platThickness
// });
// platforms.push({
//     x: width - 180,
//     y: height - 140,
//     width: 180,
//     height: platThickness
// });
// platforms.push({
//     x: 310,
//     y: height - 240,
//     width: 180,
//     height: platThickness
// });


// Setting a timer with a function to startTimer
const TIME_LIMIT = 180
let timePassed = 0
let timeLeft = TIME_LIMIT
let timerInterval = null

document.querySelector('.actual-time').innerHTML = `
    <span id="base-timer-label" class="base-timer__label">
      ${formatTimeLeft(timeLeft)}
    </span>
  `

function startTimer() {
    timerInterval = setInterval(() => {
      timePassed = timePassed += 1;
      timeLeft = TIME_LIMIT - timePassed
      document.getElementById("base-timer-label").innerHTML = formatTimeLeft(timeLeft)
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


