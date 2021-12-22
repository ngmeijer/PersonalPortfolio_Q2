const InputKeys = Object.freeze({
  Left: 65,
  Right: 68,
  Jump: 32,
  Fall: 83,
});

export default class Player extends THREE.Object3D {
  playerGFX;
  rigidBodyPos;
  defaultMoveSpeed;
  currentMoveSpeed;
  movingLeft;
  movingRight;
  delta;

  constructor(pMoveSpeed) {
    super();
    this.initializeGFX();
    this.defaultMoveSpeed = pMoveSpeed;
    this.currentMoveSpeed = 0;
    this.position.set(0, -1.75, 0);
    this.movingLeft = false;
    this.movingRight = false;
  }

  update(delta) {
    this.delta = delta;
    this.handleMovement();
    this.handleJump();
  }

  handleMovement() {
    if (this.movingLeft || this.movingRight)
      this.currentMoveSpeed = this.defaultMoveSpeed;
    else this.currentMoveSpeed = 0;

    if (this.movingLeft) {
      this.movingRight = false;
      this.position.setX(this.position.x - (this.currentMoveSpeed * this.delta));
    }
    if (this.movingRight) {
      this.movingLeft = false;
      this.position.setX(this.position.x + (this.currentMoveSpeed * this.delta));
    }
  }

  handleJump(){
    if(this.isJumping){
      
    }
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0x2305fd);
    this.playerGFX = new THREE.Mesh(playerGeo, playerMat);
    this.playerGFX.castShadow = true;
    this.playerGFX.receiveShadow = true;
    this.add(this.playerGFX);
  }
}
