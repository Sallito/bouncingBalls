const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let para = document.querySelector('p');
let count = 50;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Shape(x, y, velX, velY,exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;    
}

function Ball(x, y, velX, velY, exists,color, size) {
    Shape.call(this,x, y, velX, velY,exists);
    this.color = color;
    this.size = size;
}

function EvilCircle(x,y,velX,velY,exists,color,size){
  Shape.call(this,x,y,20,20,exists);
  this.color = 'white';
  this.size = 10;
}

  Ball.prototype = Object.create(Shape.prototype);
  EvilCircle.prototype = Object.create(Shape.prototype);
  
  Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true 
});
  Object.defineProperty(EvilCircle.prototype, 'constructor', {
    value: EvilCircle,
    enumerable: false, // so that it does not appear in 'for in' loop
    writable: true 
});

  Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  EvilCircle.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.stroke();
  }
 
  Ball.prototype.update = function() {
    if ((this.x + this.size) >= width) {
      this.velX = -(this.velX);
    }
    if ((this.x - this.size) <= 0) {
      this.velX = -(this.velX);
    }
    if ((this.y + this.size) >= height) {
      this.velY = -(this.velY);
    }
    if ((this.y - this.size) <= 0) {
      this.velY = -(this.velY);
    }
    this.x += this.velX;
  
    this.y += this.velY;

  }
EvilCircle.prototype.checkBounds = function(){
  if((this.x + this.size) >= width){
    this.x=width-this.size;
  }
  if((this.x - this.size) <= 0){
    this.x = 0+this.size;
  }
  if((this.y + this.size) >= height){
    this.y = height-this.size;
  }
  if((this.y - this.size)<=0){
 this.y = 0+this.size;
  }
}
 
let balls = [];

EvilCircle.prototype.setControls = function(){
  var _this = this;
  window.onkeydown = function(e){
    if(e.keyCode === 65){
      _this.x -= _this.velX;
    }else if(e.keyCode === 68){
      _this.x += _this.velX;
    }else if(e.keyCode === 87){
      _this.y -= _this.velY;
    }else if(e.keyCode === 83){
      _this.y += _this.velY;
    }
  }
}

  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);//?
        if (distance < this.size + balls[j].size && balls[j].exists == true) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        }
      }
    }
  }

 EvilCircle.prototype.collisionDetect = function(){
   for(let k=0;k<balls.length;k++){
     if(balls[k].exists==true){
       const dxx = this.x - balls[k].x;
       const dyy = this.y - balls[k].y;
       const ddistance = Math.sqrt(dxx*dxx+dyy*dyy);
       if(ddistance < this.size + balls[k].size){ 
        balls[k].color = `rgba( ${0},${0},${0},${0})`;
        balls[k].exists = false;
        count --;
       }
     }
   }
 }
 let ec = new EvilCircle(      
  random( 0 + 10,width -10),
  random(0+10,width -10),
  20,
  20,
  true,
  'white',
  10
);

ec.setControls();

  function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    
    while (balls.length < 50) {
      let size = random(10,20);
      let exists = true;
      let ball = new Ball(
        random(0 + size,width - size),
        random(0 + size,height - size),
        random(-7,7),
        random(-7,7),
        exists,
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
        size
      );
      balls.push(ball);
    }

   for (let i = 0; i < balls.length; i++) {
    
    if(balls[i].exists== true){
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
        
      }
    }
    
    requestAnimationFrame(loop);
    ec.draw();
    ec.checkBounds();
    ec.collisionDetect();
    para.textContent=`Contagem de bolas: ${count}`;
  
  }
 loop();