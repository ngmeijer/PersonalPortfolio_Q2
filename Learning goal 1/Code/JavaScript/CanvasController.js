export default class CanvasController {
  window;
  canvas;
  canvasWidth;
  canvasHeight;

  home_element;
  home_style;

  portfolio_element;
  portfolio_style;

  aboutme_element;
  aboutme_style;

  contact_me_element;
  contact_me_style;

  xPosHome = new THREE.Vector2();

  horizontalDelta = 0;
  verticalDelta = 0;

  foregroundSpeed;

  constructor(document, window) {
    this.document = document;
    this.window = window;
    this.onInit();
  }

  onInit() {
    this.document.onload = this.getHTML();
  }

  getHTML() {
    this.home_element = document.getElementById("home-intro");
    this.home_style = window.getComputedStyle(this.home_element);
    this.setPositionReferenceValues();
  }

  setPositionReferenceValues() {
    this.xPosHome.x = this.home_style.left;
    this.xPosHome.y = this.home_style.top;
  }

  moveUIHorizontally(progress, direction, canMove) {
    if (direction == 0 || !canMove) return;
    if (direction == -1) {
      this.horizontalDelta += this.foregroundSpeed * progress;
    } else this.horizontalDelta -= this.foregroundSpeed * progress;

    this.home_element.style.left = `${
      parseInt(this.xPosHome.x, 10) + this.horizontalDelta
    }px`;
  }

  moveUIVertically(progress, isJumping, yVelocity) {
    if (!isJumping) return;
    if (yVelocity < 0.02 && yVelocity > -0.02) return;

    console.log(yVelocity);

    this.verticalDelta += yVelocity * (progress * 100);

    this.home_element.style.top = `${
      parseInt(this.xPosHome.y, 10) + this.verticalDelta
    }px`;
  }
}
