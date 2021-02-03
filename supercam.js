

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