const InputKeys = Object.freeze({
  Left: 65,
  Right: 68,
  Jump: 32,
  Fall: 83,
});

export default class Player extends THREE.Object3D {
  playerGFX;
  moveSpeed;

  constructor(moveSpeed) {
    super();
    this.moveSpeed = moveSpeed;
    this.initializeGFX();
  }

  handleMovement(event, delta) {
    if (window.event) {
      let currentKey = event.keyCode;

      switch (currentKey) {
        case InputKeys.Left:
          this.translateX(-this.moveSpeed * delta);
          break;
        case InputKeys.Right:
          this.translateX(this.moveSpeed * delta);
          break;
      }
    }
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0x2305fd);
    this.playerGFX = new THREE.Mesh(playerGeo, playerMat);
    this.add(this.playerGFX);
  }
}
