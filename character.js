let frame = 0;

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = 500,
  height = 200,
  //player = {
  //     x: width / 2,
  //     y: height - 15,
  //     width: 5,
  //     height: 5,
  //     speed: 3,
  //     velX: 0,
  //     velY: 0,
  //     jumping: false,
  //     grounded: false
  // },
  keys = [],
  friction = 0.8,
  gravity = 0.3;

var boxes = [];

// dimensions
boxes.push({
  x: 0,
  y: 0,
  width: 10,
  height: height,
});
boxes.push({
  x: 0,
  y: height + 92,
  width: width,
  height: 150,
});
// boxes.push({
//   x: width - 10,
//   y: 0,
//   width: 50,
//   height: height,
// });

// boxes.push({
//   x: 120,
//   y: 10,
//   width: 80,
//   height: 80,
// });
// boxes.push({
//   x: 170,
//   y: 50,
//   width: 80,
//   height: 80,
// });
boxes.push({
  x: 220,
  y: 100,
  width: 80,
  height: 80,
});
boxes.push({
  x: 270,
  y: 150,
  width: 40,
  height: 40,
});

canvas.width = width;
canvas.height = height;

class Player {
  constructor(x, y, w, h, src) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.velX = 0;
    this.velY = 0;
    this.speed = 6;
    this.src = src;
    this.jumping = false;
    this.grounded = false;
    this.img = null;
    this.sx = 0; //frame of animation
    this.sy = 0; //animation type
    this.sw = null;
    this.sh = null;
    this.numberTall = 5;
    this.numberWide = 10;
    this.health = 100;
    this.special = 0;
    this.flip = false;
  }

  update(ctx) {
    //check collision
    // if(!this.checkCollision())
    // {
    //  this.velY += gravity;
    //   this.y += this.velY;
    // }else {
    //   this.velY = 0;
    // }

    this.draw(ctx);
  }
  load() {
    let img = new Image();
    img.src = this.src;
    img.onload = () => {
      this.img = img;
      this.sw = img.width / this.numberWide;
      this.sh = img.height / this.numberTall;
      this.sy = this.sh * 3;
      this.draw(img);
    };
    console.log(img);
  }
  draw() {
    if (!this.flip) {
      ctx.save();
      if (frame % 10 === 0) {
        if (this.sx < this.img.width - this.sx) {
          this.sx += this.sw;
        } else {
          this.sx = 0;
        }
      }

      ctx.drawImage(
        this.img,
        this.sx,
        this.sy,
        this.sw,
        this.sh,
        this.x,
        this.y,
        this.width,
        this.height
      );
      ctx.restore();
    } else {
      ctx.save()
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1)

      if (frame % 10 === 0) {
        if (this.sx < this.img.width - this.sx) {
          this.sx += this.sw
        } else {
          this.sx = 0;
        }
      }


      ctx.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.x, this.y, this.width, this.height)
      ctx.restore()
    }

  }
  reverse() {
    this.flip = !this.flip;
  }
  jump() {
    // this.velY = (-this.speed)*2;
    // this.y = this.y + this.velY
    // this.fall();
  }
  dead() {
    this.numberWide = 10;
    this.sy = 0;
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
}
