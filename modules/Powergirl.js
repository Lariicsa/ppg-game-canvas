'use  strict'
export default class Powergirl {
  constructor(xPos, yPos, girlLength, girlHeight, girlSpeed, selectedGirl, context) {
    this.x = xPos;
    this.y = yPos;
    this.l = girlLength;
    this.height = girlHeight;
    this.s = girlSpeed;
    this.srcImage = this.chooseGirl(selectedGirl);
    this.context = context
  }

  chooseGirl(g) {
    let img1 = "./images/blossom.png";
    let img2 = "./images/bubbles.png";
    let img3 = "https://im.fantasticocomic.com/img/rocket-sin-letras.png";
    let images = [img1, img2, img3];
    return images[g];
  }

  draw() {
    let image = new Image();
    image.src = this.srcImage;
    this.context.drawImage(image, this.x, this.y, this.l, this.height);
  }
}