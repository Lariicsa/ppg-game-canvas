let canvas = document.getElementById('canvas')
let context = canvas.getContext('2d')
let end = document.querySelector('.end')
let endScore = document.querySelector('.end-score') //ADD SCORE STYLE LIKE PPG
let up = false
let down = false
let space = false
let shooting = false

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
    this.audio.loop = true

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
  constructor(x, y, length, speed, num) {
    this.x= x
    this.y= y
    this.l= length
    this.s= speed
    this.imgv1 = new Image()
    this.imgv1.src = './images/mojo-jojo.png'
    this.imgv2 = new Image()
    this.imgv2.src = './images/sedusa.png'
    this.imgv3 = new Image()
    this.imgv3.src = './images/him.png'
    this.imgv4 = new Image()
    this.imgv4.src = './images/ameaba.png'
    this.imgv5 = new Image()
    this.imgv5.src = './images/princess.png'
    this.imgv6 = new Image()
    this.imgv6.src = './images/gruber.png'
    this.imgv7 = new Image()
    this.imgv7.src = './images/snake.png'
    this.num = num
  }

  draw(num) {
    if(num === 0) {
      context.drawImage(this.imgv1, this.x, this.y, this.l, this.l)
    } else if (num === 1){
      context.drawImage(this.imgv2, this.x, this.y, this.l, this.l)
    } else if (num === 2){
      context.drawImage(this.imgv3, this.x, this.y, this.l, this.l)
    }
  }
}

let enemies = []
let enemyBaseSpeed = 2
function makeEnemy() {
  let num = Math.round((Math.random() * 2))
  let enemyX = canvas.width
  let enemySize = Math.round((Math.random() * 100)) + 15
  let enemyY = Math.round(Math.random() * (canvas.height - enemySize * 2)) + enemySize
  let enemySpeed = Math.round(Math.random() * enemyBaseSpeed) + enemyBaseSpeed
  enemies.push(new Enemy(enemyX, enemyY, enemySize, enemySpeed, num))

}

class Candy{
  constructor(x,y,speed) {
    this.x= this.x
    this.y= this.y
    this.s= speed
    this.height = 24
    this.width = 24
    this.imgc1 = new Image()
    this.imgc1.src = './images/candy.png'
  }

  draw() {
      context.drawImage(this.imgc1, this.x, this.y, this.height, this.width)
  }
}

let candies = []
let candiesBaseSpeed = 2
function makeCandies() {
  let candyX = canvas.width
  let candySize = Math.round((Math.random() * 100)) + 15
  let candyY = Math.round(Math.random() * (canvas.height - candySize * 2)) + candySize
  let candySpeed = Math.round(Math.random() * candiesBaseSpeed) + candiesBaseSpeed
  enemies.push(new Enemy(candyX, candyY, this.height, this.width, candySpeed))
  console.log(candies)
}

//Background
const board = new Board()
//girl
const girl = new Powergirl(50, canvas.height / 2, 116, 48, 5)
//Candy
const gum = new Candy(0, 0, 100, 14, 10)


console.log(gum)

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


function isWithin(a, b, c) {
  return (a > b && a < c)
}


function isColliding(a, b) {
  let result = false
  if (isWithin(a.x, b.x, b.x + b.l) || isWithin(a.x + a.l, b.x, b.x + b.l)) {
    if (isWithin(a.y, b.y, b.y + b.l) || isWithin(a.y + a.l, b.y, b.y + b.l)) {
      result = true
    }
  }
  return result
}


let score = 0

let timeBetweenEnemies = 5 * 1000

let timeoutId = null


function startGame() {
	// Kick off the enemy spawn interval
  timeoutId = setInterval(makeEnemy, timeBetweenEnemies)

  board.draw()
  // Make the first enemy
  
  setTimeout(makeEnemy, 1000)

  draw()
  //canvas.removeEventListener('click', startGame)
}

// Show the end game screen
function endGame() {
  board.draw()
  clearInterval(timeoutId)
  
  erase()
  context.font = '50px Sonsie One'

  board.draw()
  context.fillStyle = '#213867'
  context.fillText('Game Over.', canvas.width/2 -200, canvas.height / 2)
  scoreHearts(score)
}

function scoreHearts(score) {
  board.audio.currentTime = 0
  board.audio.pause()

  end.style.display = 'flex'
  endScore.innerHTML = `Your Score: ${score}`
}


canvas.addEventListener('keydown', function(event) {
  event.preventDefault()
  if (event.keyCode === 38) { // UP
    up = true
  }
  if (event.keyCode === 40) { // DOWN
    down = true
  }
  if (event.keyCode === 32) { // SPACE
    shoot()
  }
  if (event.keyCode === 13) {
      board.audio.play()
      return startGame()
  }
})


canvas.addEventListener('keyup', function(event) {
  event.preventDefault()
  if (event.keyCode === 38) { // UP 
    up = false
  }
  if (event.keyCode === 40) { // DOWN
    down = false
  }
})


function erase() {
  context.fillRect(0, 0, 800, 400)
}


function shoot() {
  if (!shooting) {
    shooting = true
    bullet.x = girl.x + girl.l
    bullet.y = girl.y + girl.height / 2
  }
}

let num = Math.round((Math.random() * 2))

function draw() {
  erase()
  board.draw()
  gum.draw()
  let gameOver = false

  enemies.forEach(function(enemy, i) {
    enemy.draw(num)
    enemy.x -= enemy.s
    if (enemy.x < 0) {
      gameOver = true
    }
    context.fillStyle = '#111'
  })


  enemies.forEach(function(enemy, i) {
    if (isColliding(enemy, girl)) {
      enemy.draw()  //added
      gameOver = true
    }
  })

  if (down) {
    girl.y += girl.s
  }
  if (up) {
    girl.y -= girl.s
  }
 
  if (girl.y < 0) {
    girl.y = 0
  }
  if (girl.y > canvas.height - girl.height) {
    girl.y = canvas.height - girl.height
  }

  girl.draw()
 
  if (shooting) {
   
    bullet.x += bullet.s

    enemies.forEach(function(enemy, i) {
      
      enemy.draw() 
      if (isColliding(bullet, enemy)) {
        enemies.splice(i, 1)
        score++
        shooting = false

        if (score % 10 === 0 && timeBetweenEnemies > 1000) {
          clearInterval(timeoutId)
          timeBetweenEnemies -= 1000
          timeoutId = setInterval(makeEnemy, timeBetweenEnemies)
        } else if (score % 2 === 0) {
          enemyBaseSpeed += 3
        }
      }

    })
   
    if (bullet.x > canvas.width) {
      shooting = false
    }
  
    context.fillStyle = 'magenta'
    bullet.draw()
  }
 

  context.font = '24px Arial'
  context.textAlign = 'left'
  context.fillText('Score: ' + score, 1, 25)

  if (gameOver) {
    endGame()
  } else {
    window.requestAnimationFrame(draw)
  }
}

 //canvas.focus()


//startGame()