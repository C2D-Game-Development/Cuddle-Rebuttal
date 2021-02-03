


let zoomfactor = 1

const padding = 0
let distance=1;

setInterval(function () {

    let midpoint = {
        y: (player1.y + player2.y) / 2, x: (player1.x + player2.x) / 2
    }
    // distance = (Math.abs(player2.x-player1.x))+500
    distance = Math.sqrt(((player1.x-player2.x)**2)+((player1.y-player2.y)**2))
    // console.log(zoomfactor)
    // zoomfactor = (Math.sqrt(canvas.width**2 +canvas.height**2)/distance)
    // let midpoint = {
    //     y: (player1.y + player2.y +player1.h) / 2 +padding/2, x: ((player1.x + player2.x +player1.w) / 2) +padding/2
    // }
    // //distance = (Math.abs(player2.x-player1.x))+500
    // distance = Math.sqrt(((player1.x-player2.x+padding+player1.w)**2)+((player1.y-player2.y+padding + player1.h)**2))
    console.log(midpoint)
    zoomfactor = Math.max(Math.min((Math.sqrt(canvas.width**2 +canvas.height**2)/distance)*0.7,1.5),0.9)
    
    // if (zoomfactor < 2) {a

        canvas.style.border = '10px solid blue'

        canvas.style.transform = `scale(${zoomfactor})`
        canvas.style.transformOrigin = `${midpoint.x}px  ${midpoint.y}px`


    // } else {

    //     zoomfactor = 1
    //     canvas.style.border = '10px solid green'
    // }
    // ctx.transform(zoomfactor, 0, 0, zoomfactor, -(zoomfactor - 1) * canvas.width / 2, -(zoomfactor - 1) * canvas.height / 2)

    // ctx.setTransform(1, 0, 0, 2, 0, 0);
    // var widthNew = ctx.canvas.width / 2;
    // var heightNew = ctx.canvas.height / 2;
    // ctx.setTransform(scale, 0, 0, scale, -(scale - 1) * widthNew, -(scale - 1) * heightNew);
    //ctx.translate(10, 10);
    // console.log(scale)
    // ctx.scale(2, 2)
}, 5)


// let scale = 1
// setInterval(function(){
//     console.log(player1.x, player1.y, canvas.style.transform, canvas.width)

//     let xoff =   canvas.width/2 - player1.x//player1.x// Math.random()*canvas.width;
//     let yoff =  canvas.height/2 - player1.y// player1.y// Math.random()*canvas.height;
//     scale+=.1
//     canvas.style.transform = "translate(" + xoff + "px, " + yoff + "px) scale(" + scale + ")";
// }, 1000)


// var scale = 1,
//     panning = false,
//     xoff = 0,
//     yoff = 0,
//     start = {x: 0, y: 0},
//     doc = document.getElementById("canvas");

// function setTransform() {
//   doc.style.transform = "translate(" + xoff + "px, " + yoff + "px) scale(" + scale + ")";
// }

// doc.onmousedown = function(e) {
//   e.preventDefault();
//   start = {x: e.clientX - xoff, y: e.clientY - yoff};    
//   panning = true;
// }

// doc.onmouseup = function(e) {
//   panning = false;
// }

// doc.onmousemove = function(e) {
//   e.preventDefault();         
//   if (!panning) {
//     return;
//   }
//   xoff = player1.x;
//   yoff = player1.y;
//   setTransform();
// }


// doc.onclick = function(e) {
//     e.preventDefault(); console.log(e.deltaY, player1)
//     // take the scale into account with the offset
//     var xs = (player1.x - xoff) / scale,
//         ys = (player1.y - yoff) / scale
//         //delta = -1//(e.wheelDelta ? e.wheelDelta : -e.deltaY);

//     // get scroll direction & set zoom level
//    // (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);
//    scale *= 1.2;
//     // reverse the offset amount with the new scale
//     xoff = player1.x - xs * scale;
//     yoff = player1.y - ys * scale;

//     setTransform();          
// }

// // function zoomCam() {
// //     var xs = (0 - xoff) / scale,
// //         ys = (0 - yoff) / scale,
// //         delta = 10;

// //     // get scroll direction & set zoom level
// //     (delta > 0) ? (scale *= 1.2) : (scale /= 1.2);

// //     // reverse the offset amount with the new scale
// //     xoff = 0 - xs * scale;
// //     yoff = 100 - ys * scale;
// //     console.log('hello')
// //     setTransform();       
// // }

// // setInterval(zoomCam, 1000)
// console.log('hi')