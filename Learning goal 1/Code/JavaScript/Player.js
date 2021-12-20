const InputKeys = Object.freeze({
  Left: 65,
  Right: 68,
  Jump: 32,
  Fall: 83,
});

export default class Player extends THREE.Object3D {
  playerGFX;
  defaultMoveSpeed;
  currentMoveSpeed;

  constructor(pMoveSpeed) {
    super();
    this.initializeGFX();
    this.defaultMoveSpeed = pMoveSpeed;
    this.position.set(0,-2,0);
  }

  update(delta){
    console.log(this.position);
    //this.position.x += (this.currentMoveSpeed * delta);
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0x2305fd);
    this.playerGFX = new THREE.Mesh(playerGeo, playerMat);
    this.add(this.playerGFX);
  }
}