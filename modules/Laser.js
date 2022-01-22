"use strict";
export default class Laser {
  constructor(x, y, length, height, speed, context) {
    this.x = x;
    this.y = y;
    this.l = length;
    this.height = height;
    this.s = speed;
    this.imgpow = new Image();
    this.imgpow.src = "./images/power.png";
    this.audio = new Audio();
    this.audio.src = "./ppg-laser.mp3";
    this.context = context
  }

  draw() {
    this.context.drawImage(this.imgpow, this.x, this.y, this.l, this.height);
  }
}
