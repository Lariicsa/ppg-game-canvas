"use strict";
export default class Board {
  constructor(canvasWidth, canvasHeight, context) {
    console.log(canvasWidth + "--" + canvasHeight);
    this.x = 0;
    this.y = 0;
    this.width = canvasWidth;
    this.height = canvasHeight;
    this.context = context;
    this.img = new Image();
    this.img.src = "./images/townsville.png";
    this.img.onload = () => {
      this.draw();
    };
    this.audio = new Audio();
    this.audio.src = "./ppg-audio.mp3";
    this.audio.loop = true;
    this.audio2 = new Audio();
    this.audio2.src = "./ppg-end.mp3";
    this.audio2.loop = true;
  }
  draw() {
    this.x--;
    if (this.x < -this.width) {
      this.x = 0;
    }
    this.context.drawImage(this.img, this.x, this.y, this.width, this.height);
    this.context.drawImage(
      this.img,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}
