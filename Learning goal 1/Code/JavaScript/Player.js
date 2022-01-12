export default class Player extends THREE.Object3D {
  playerMesh;
  playerBody;
  defaultMoveSpeed;
  currentMoveSpeed;
  jumpForce;
  movingLeft;
  movingRight;
  delta;
  framesToJump = 60;
  jumpDeltaPerFrame;
  jumpDeltaLeft;

  constructor(pMoveSpeed, pJumpForce) {
    super();
    this.initializeGFX();
    this.defaultMoveSpeed = pMoveSpeed;
    this.currentMoveSpeed = 0;
    this.jumpForce = pJumpForce;
    this.jumpDeltaPerFrame = this.jumpForce / this.framesToJump;
    console.log(this.jumpDeltaPerFrame)
    this.playerMesh.position.x = 0;
    this.playerMesh.position.y = 3;
    this.movingLeft = false;
    this.movingRight = false;
  }

  update(delta) {
    this.delta = delta;
    this.handleMovement();

    this.playerMesh.position.set(
      this.playerBody.position.x,
      this.playerBody.position.y,
      this.playerBody.position.z
    );
    this.playerMesh.quaternion.set(
      this.playerBody.quaternion.x,
      this.playerBody.quaternion.y,
      this.playerBody.quaternion.z,
      this.playerBody.quaternion.w
    );
  }

  handleMovement() {
    if (this.movingLeft || this.movingRight)
      this.currentMoveSpeed = this.defaultMoveSpeed;
    else this.currentMoveSpeed = 0;

    if (this.movingLeft) {
      this.movingRight = false;
      this.playerBody.position.x =
        this.playerBody.position.x - this.currentMoveSpeed * this.delta;
    }
    if (this.movingRight) {
      this.movingLeft = false;
      this.playerBody.position.x =
        this.playerBody.position.x + this.currentMoveSpeed * this.delta;
    }
  }

  handleJump() {
    this.jumpDeltaLeft = this.jumpForce;

    this.playerBody.velocity.y = this.jumpForce;

    // if (this.jumpDeltaLeft > 0) {
    //   this.playerBody.position.y =
    //     this.playerBody.position.y + this.jumpForce * this.delta;

    //     this.jumpDeltaLeft -= this.jumpDeltaPerFrame;
    // }
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 1);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0x2305fd);
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.playerMesh.castShadow = true;
    this.playerMesh.receiveShadow = true;
    this.add(this.playerMesh);

    const playerShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.5));
    this.playerBody = new CANNON.Body({ mass: 1 });
    this.playerBody.addShape(playerShape);
    this.playerBody.position.x = this.playerMesh.position.x;
    this.playerBody.position.y = this.playerMesh.position.y;
    this.playerBody.position.z = this.playerMesh.position.z;
    this.playerBody.restitution = 0;
  }
}
