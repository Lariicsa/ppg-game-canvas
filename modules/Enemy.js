"use strict";

export default class Enemy {
  constructor(xPos, yPos, length, speed, context) {
    this.x = xPos;
    this.y = yPos;
    this.l = length;
    this.s = speed;
    this.context = context;
    let index = Math.round(Math.random() * 6);
    this.srcImage = this.chooseEnemy(index);
  }

  chooseEnemy(num) {
    let imgv1 = "./images/mojo-jojo.png";
    let imgv2 = "./images/sedusa.png";
    let imgv3 = "./images/him.png";
    let imgv4 = "./images/ameaba.png";
    let imgv5 = "./images/princess.png";
    let imgv6 = "./images/gruber.png";
    let imgv7 = "./images/snake.png";
    let images = [imgv1, imgv2, imgv3, imgv4, imgv5, imgv6, imgv7];
    return images[num];
  }

  draw() {
    let image = new Image();
    image.src = this.srcImage;
    this.context.drawImage(image, this.x, this.y, this.l, this.l);
  }
}
