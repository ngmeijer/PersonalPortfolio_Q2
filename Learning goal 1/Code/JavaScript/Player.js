export default class Player extends THREE.Object3D {
  playerMesh;
  playerBody;
  playerPosition;
  defaultMoveSpeed;
  currentMoveSpeed;
  jumpForce;
  isJumping;
  movingLeft;
  movingRight;
  velocity;
  canMove = true;
  delta;
  light;
  lightOffset = new THREE.Vector3(0, 20, 5);

  tweenScaleIn;

  constructor(pMoveSpeed, pJumpForce, pPosition) {
    super();
    this.defaultMoveSpeed = pMoveSpeed;
    this.playerPosition = pPosition;

    this.initializeGFX();
    this.initializeBody();

    this.currentMoveSpeed = 0;
    this.jumpForce = pJumpForce;
    this.jumpDeltaPerFrame = this.jumpForce / this.framesToJump;
    this.movingLeft = false;
    this.movingRight = false;

    this.tweenScaleIn = new TWEEN.Tween(this.playerMesh.scale)
      .to(
        {
          x: this.playerMesh.scale.x - this.playerMesh.scale.x * 0.2,
          y: this.playerMesh.scale.y,
          z: this.playerMesh.scale.z,
        },
        500
      )
      .easing(TWEEN.Easing.Quadratic.In)

      this.tweenScaleOut = new TWEEN.Tween(this.playerMesh.scale)
      .to(
        {
          x: 1,
          y: this.playerMesh.scale.y,
          z: this.playerMesh.scale.z,
        },
        500
      )
      .easing(TWEEN.Easing.Quadratic.In)


  }

  update(delta) {
    this.delta = delta;
    this.velocity = this.playerBody.velocity;
    this.handleMovement();

    this.playerPosition = this.playerBody.position;
    this.playerBody.quaternion.set(0, 0, 0, 1);
    this.playerMesh.position.set(
      this.playerPosition.x,
      this.playerPosition.y,
      this.playerPosition.z
    );
    this.playerMesh.quaternion.set(
      this.playerBody.quaternion.x,
      this.playerBody.quaternion.y,
      this.playerBody.quaternion.z,
      this.playerBody.quaternion.w
    );

    this.playerBody.velocity = this.velocity;
  }

  moveIntoPortfolioItem(){
    console.log("moving into portfolio item");
  }

  handleMovement() {
    if (!this.movingLeft && !this.movingRight) {
      this.currentMoveSpeed = 0;
      if(this.playerMesh.scale.x != 1)this.tweenScaleOut.start();
      return;
    }

    if(this.playerMesh.scale.x == 1)this.tweenScaleIn.start();

    if (this.movingLeft || this.movingRight)
      this.currentMoveSpeed = this.defaultMoveSpeed;

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
    if (this.velocity.y > -0.2 && this.velocity.y < 0.2) {
      this.velocity.y = this.jumpForce;
      this.isJumping = true;
    } else this.isJumping = false;
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0xf48c06);
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.playerMesh.castShadow = true;
    this.playerMesh.receiveShadow = true;
    this.add(this.playerMesh);
  }

  initializeBody() {
    const playerShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.5));
    this.playerBody = new CANNON.Body({ mass: 1 });
    this.playerBody.addShape(playerShape);
    this.playerBody.position.x = this.playerPosition.x;
    this.playerBody.position.y = this.playerPosition.y;
    this.playerBody.position.z = this.playerPosition.z;
    this.playerBody.restitution = 0;
  }
}
