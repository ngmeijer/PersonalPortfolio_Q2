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
  
    delta = 0;
  
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
      this.home_element = document.getElementById('home-intro');
      this.home_style = window.getComputedStyle(this.home_element);
      this.setPositionReferenceValues();
    }
  
    setPositionReferenceValues(){
      this.xPosHome = this.home_style.left;
    }
    
    moveUI(progress, direction, canMove) {
      if(direction == 0 || !canMove) return;
      if (direction == -1) {
          this.delta += this.foregroundSpeed * progress;
      } else this.delta -= this.foregroundSpeed * progress;

      this.home_element.style.left = `${parseInt(this.xPosHome, 10) + this.delta}px`;
    }
  }