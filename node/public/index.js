let yourId = null;
let firstUser = null;
const socket = io("http://localhost:3000");


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
//////Images for game////////
/////////////////////////////

let floor = new Image();
floor.src = "./images/floor.jpg";

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


let images = {
  floor,
  catReverse,
  cat,
  dog,
  dogReverse,
  bloodBoltR,
  bloodBoltL
}
/////////////////////////////
//////Classes for game///////
/////////////////////////////










const canvas = document.querySelector('canvas')
const ctx = canvas.getContext("2d");
canvas.width = 1000
canvas.height = 500





function drawPlayer(player) {


  console.log(images[player.img])
  // if (frame % 3 == 0 && player.special < 100) {
  //   player.special++;
  //   if (player.img == cat) {
  //     document.querySelector("#energy-1").style.width = `${player.special}%`;
  //   } else {
  //     document.querySelector("#energy-2").style.width = `${player.special}%`;
  //   }
  // }

  if (player.sy == 0 && frame % 20 == 0) {
    player.sx += player.sw;
  }
  // Idle-foolishness
  // if (player.sy == player.sh*3 && frame % 10 == 0){
  //   player.sx += player.sw
  // }
  if (player.sy == player.sh * 4 && frame % 5 == 0) {
    player.sx += player.sw;
  }

  if (player.sx >= (player.numberWide - 1) * player.sw) {
    if (player.keepLooping) {
      player.sx = 0;
    } else {
      player.sx = (player.numberWide - 1) * player.sw;
    }
  }
  console.log(player)
  if (player.direction == "left") {
    ctx.drawImage(
      images[player.img],
      player.sx,
      player.sy,
      player.sw,
      player.sh,
      player.x,
      player.y,
      player.w,
      player.h
    );
  } else {
    ctx.drawImage(
      images[player.rImg],
      player.sx,
      player.sy,
      player.sw,
      player.sh,
      player.x,
      player.y,
      player.w,
      player.h
    );
  }
}



function drawBarrier(canvasDisplay) {
  let { img, x, y, w, h } = canvasDisplay.createFloor
  //ctx.fillRect(0, 0, 100, 100)
  ctx.drawImage(images[img], x, y, w, h);
}


let interval = null;
let frame = 0;




socket.on('displayCanvas', ({ canvasDisplay }) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //console.log(canvasDisplay)
  drawBarrier(canvasDisplay)
  drawPlayer(canvasDisplay.createPlayer1)
  drawPlayer(canvasDisplay.createPlayer2)



})



socket.on("yourId", ({ id, firstUser }) => {
  console.log("your id is", id, firstUser);
  yourId = id;
  firstUser = firstUser
});

window.onkeydown = (event) => {
  //When I press a key i tell the server which key and who pressed it
  socket.emit("keyFromClient", { keyCode: event.keyCode, id: yourId });
};


window.onkeyup = (event) => {
  //When I press a key i tell the server which key and who pressed it
  socket.emit("keyUpFromClient", { keyCode: event.keyCode, id: yourId });
};


// socket.on("keyFromServer", ({ keyCode, id }) => {
//   console.log(keyCode, id);
//   keys[keyCode] = true;
// });
// socket.on("keyUpFromServer", ({ keyCode, id }) => {
//   console.log(keyCode, id);
//   keys[keyCode] = false;
// });

// socket.on('newUser', (data) => {
//   console.log('newUser', data)
//   //window.location.reload()
// })



