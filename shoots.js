let canvas = document.getElementById('canvas');

let context = canvas.getContext('2d');

class Board {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = './images/townsville.png'
    this.img.onload = () => {
      this.draw()
    }
    this.audio = new Audio()
    this.audio.src = './ppg-audio.mp3'
    this.audio.onload = () =>{
      this.playAudio()
    }

  }
  draw() {
    this.x--
    if (this.x < -canvas.width) {
      this.x = 0
    }
    context.drawImage(this.img, this.x, this.y, this.width, this.height)
    context.drawImage(
      this.img,
      this.x + canvas.width,
      this.y,
      this.width,
      this.height,
    )
  }

  playAudio() {
    this.audio = true;
  }
  
}


class Powergirl{
  constructor(x, y, length, height, speed) {
    this.x= x
    this.y= y
    this.l= length
    this.height = height
    this.s= speed
    this.img = new Image()
    this.img.src = './images/buttercup1.png'
    this.imgl = new Image()
    this.imgl.src = './images/power.png'
  }

  draw() {
    context.drawImage(this.img, this.x, this.y, this.l, this.height)
  }
}


class Enemy{
  constructor(x, y, length, speed) {
    this.x= x
    this.y= y
    this.l= length
    this.s= speed
    this.imgv1 = new Image()
    this.imgv1.src = './images/gruber.png'
  }

  draw() {
    context.drawImage(this.imgv1, this.x, this.y, this.l, this.l)
  }
}

let enemies = [];

let enemyBaseSpeed = 2;
function makeEnemy() {
  var enemyX = canvas.width;
  var enemySize = Math.round((Math.random() * 45)) + 15;
  var enemyY = Math.round(Math.random() * (canvas.height - enemySize * 2)) + enemySize;
  var enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed;
  enemies.push(new Enemy(enemyX, enemyY, enemySize, enemySpeed));
}

//Background
const board = new Board()

console.log(board)

//girl
const girl = new Powergirl(50, canvas.height / 2, 116, 48, 5)

let up = false;
let down = false;
let space = false;
let shooting = false;

class Laser{
  constructor(x, y, length, height, speed) {
    this.x= x
    this.y= y
    this.l= length
    this.height = height
    this.s= speed
    this.imgpow = new Image()
    this.imgpow.src = './images/power.png'
  }

  draw() {
    context.drawImage(this.imgpow, this.x, this.y, this.l, this.height)
  }
}

const bullet = new Laser(0, 0, 100, 14, 10)

console.log(bullet)


function isWithin(a, b, c) {
  return (a > b && a < c);
}


function isColliding(a, b) {
  let result = false;
  if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
    if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
      result = true;
    }
  }
  return result;
}


let score = 0;

let timeBetweenEnemies = 5 * 1000;

let timeoutId = null;


function startGame() {
  
	// Kick off the enemy spawn interval
  timeoutId = setInterval(makeEnemy, timeBetweenEnemies);

  board.draw()
  // Make the first enemy
  
  setTimeout(makeEnemy, 1000);

  draw();
  
  canvas.removeEventListener('click', startGame);
}

// Show the end game screen
function endGame() {
  board.draw()
	
  clearInterval(timeoutId);
  
  erase();
  context.font = '50px Sonsie One'

  board.draw()
  context.fillStyle = '#213867';
  context.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
  
}


canvas.addEventListener('keydown', function(event) {
  event.preventDefault();
  if (event.keyCode === 38) { // UP
    up = true;
  }
  if (event.keyCode === 40) { // DOWN
    down = true;
  }
  if (event.keyCode === 32) { // SPACE
    shoot();
  }
});


canvas.addEventListener('keyup', function(event) {
  event.preventDefault();
  if (event.keyCode === 38) { // UP 
    up = false;
  }
  if (event.keyCode === 40) { // DOWN
    down = false;
  }
});


function erase() {
  context.fillRect(0, 0, 800, 400);
}


function shoot() {
  if (!shooting) {
    shooting = true;
    bullet.x = girl.x + girl.l;
    bullet.y = girl.y + girl.height / 2;
  }
}


function draw() {
  erase();
  board.draw()
  let gameOver = false;

  enemies.forEach(function(enemy) {
    enemy.draw() //added
    enemy.x -= enemy.s;
    if (enemy.x < 0) {
      gameOver = true;
    }
    context.fillStyle = '#111';
    
  });

  enemies.forEach(function(enemy, i) {
    if (isColliding(enemy, girl)) {
      enemy.draw()  //added
      gameOver = true;
    }
  });

  if (down) {
    girl.y += girl.s;
  }
  if (up) {
    girl.y -= girl.s;
  }
 
  if (girl.y < 0) {
    girl.y = 0;
  }
  if (girl.y > canvas.height - girl.height) {
    girl.y = canvas.height - girl.height;
  }

  girl.draw();
 
  if (shooting) {
   
    bullet.x += bullet.s;

    enemies.forEach(function(enemy, i) {
      enemy.draw() //added
      if (isColliding(bullet, enemy)) {
        enemies.splice(i, 1);
        score++;
        shooting = false;

        if (score % 10 === 0 && timeBetweenEnemies > 1000) {
          clearInterval(timeoutId);
          timeBetweenEnemies -= 1000;
          timeoutId = setInterval(makeEnemy, timeBetweenEnemies);
        } else if (score % 5 === 0) {
          enemyBaseSpeed += 1;
        }
      }
    });
   
    if (bullet.x > canvas.width) {
      shooting = false;
    }
  
    context.fillStyle = '#09f';
    bullet.draw();
  }
 

  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText('Score: ' + score, 1, 25)

  if (gameOver) {
    endGame();
  } else {
    window.requestAnimationFrame(draw);
  }
}

 canvas.focus();


startGame()