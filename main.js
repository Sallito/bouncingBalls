
const canvas = document.querySelector('canvas');
//fornece o contexto ctx = área de desenho
const ctx = canvas.getContext('2d');
//altura e largura do canvas igual do navegador
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

//retorna um número aleatório a partir de 2 números
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

//construtor de bolas
function Shape(x, y, velX, velY,exists) {
    //coordenadas do spaw da bola na tela
    this.x = x;
    this.y = y;
    //velocidade vertica/horizontal da bola
    this.velX = velX;
    this.velY = velY;
    this.exists=exists;
    
  }
function Ball(x, y, velX, velY, exists,color, size) {
    //coordenadas do spaw da bola na tela

    Shape.call(this,x, y, velX, velY,exists);
    //cor
    this.color = color;
    //tamanho do raio em px
    this.size = size;
  }
  function EvilCircle(x,y,velX,velY,exists,color,size){
    Shape.call(this,x,y,20,20,exists);
    this.color = 'white';
    this.size = 10;
  }
  
  Ball.prototype = Object.create(Shape.prototype);
  EvilCircle.prototype = Object.create(Shape.prototype);
  
  //protótipo(métodos) de desenho da bola
  //declaração para desenhar      
  Ball.prototype.draw = function() {
    ctx.beginPath();
    //define a cor da forma
    ctx.fillStyle = this.color;
    //traça a forma do arco(coordenadas do lugar(x,y),raio(size),inicio e fim em graus do raio(somente em radianos)
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    //terminar de desenhar desde beginPath() e preencher toda a área com a cor fillStyle
    ctx.fill();
  }
 
  Ball.prototype.update = function() {
  //se posição horizontal + tamanho for maior ou igual que largura da tela
    if ((this.x + this.size) >= width) {
  //velocidade horizontal = velocidade horizontal negativa
      this.velX = -(this.velX);
    }
  //se posição horizontal - tamanho for menor ou igual a zero
    if ((this.x - this.size) <= 0) {
  //velocidade horizontal = velocidade horizontal negativa
      this.velX = -(this.velX);
    }
  //se posição vertical + tamanho for maior ou igual a altura da tela
    if ((this.y + this.size) >= height) {
        //velocidade vertical = velocidade vertical negativa
      this.velY = -(this.velY);
    }
  //se posição vertical - tamanho for menor ou igual a zero
    if ((this.y - this.size) <= 0) {
  //velocidade vertical = velocidade vertical negativa
      this.velY = -(this.velY);
    }
    //posição horizontal = posição horizontal + velocidade horizontal
    this.x += this.velX;
  
    //posição vertical = posição vertical + velocidade vertical
    this.y += this.velY;
  }
// alterar o valor de x/y para que o círculo maligno seja devolvido na tela um pouco. Adicionar ou subtrair (conforme apropriado) a propriedade size do círculo maligno faria sentido.

 
  Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      //testa para ver se a bola do método que chamou este método são diferentes
        if (!(this === balls[j])) {
            //ve se uma bola se sobrepõe a outra
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  //se houver a colisão, alterar a cor das bolas
        if (distance < this.size + balls[j].size) {
          balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        }
      }
    }
  }
//array para colocar as bolas, uui
  let balls = [];

  //loop de animação
  function loop() {
  //define cor da tela
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  //desenha um retângulo
    ctx.fillRect(0, 0, width, height);

    //cria as bolas e coloca dentro da array
    while (balls.length < 50) {
      let size = random(10,20);
      let exists = true;
      let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
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
  //cria o efeito em cada bola
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  //faz a função ser repetida diversas vezes
    requestAnimationFrame(loop);
  }
  //chama a função
  loop();

