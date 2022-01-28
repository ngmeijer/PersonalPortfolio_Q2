export default class Player extends THREE.Object3D {
  playerMesh;
  playerBody;
  pos;
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
  tweenScaleOut;
  tweenJumpIn;
  tweenJumpOut;
  tweenRotate;
  tweenMoveIntoZ;
  originalScale;
  currentScale;

  constructor(pMoveSpeed, pJumpForce, pPosition) {
    super();
    this.defaultMoveSpeed = pMoveSpeed;
    this.pos = pPosition;

    this.initializeGFX();
    this.initializeBody();

    this.currentMoveSpeed = 0;
    this.jumpForce = pJumpForce;
    this.jumpDeltaPerFrame = this.jumpForce / this.framesToJump;
    this.movingLeft = false;
    this.movingRight = false;

    this.prepareTweens();
  }

  update(delta) {
    this.delta = delta;
    this.velocity = this.playerBody.velocity;
    this.currentScale = this.playerMesh.scale;
    this.handleMovement();

    this.playerBody.quaternion.set(0, 0, 0, 1);
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

    this.pos = this.playerBody.position;
    this.playerBody.velocity = this.velocity;
  }

  prepareTweens() {
    this.tweenScaleIn = new TWEEN.Tween(this.playerMesh.scale)
      .to(
        {
          x: this.originalScale.x - this.originalScale.x * 0.4,
          y: this.originalScale.y,
          z: this.originalScale.z,
        },
        150
      )
      .easing(TWEEN.Easing.Exponential.In);

    this.tweenScaleOut = new TWEEN.Tween(this.playerMesh.scale)
      .to(
        {
          x: this.originalScale.x,
          y: this.originalScale.y,
          z: this.originalScale.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Elastic.Out);

    this.tweenJumpIn = new TWEEN.Tween(this.playerMesh.scale)
      .to(
        {
          x: 1,
          y: 2,
          z: 1,
        },
        250
      )
      .easing(TWEEN.Easing.Cubic.In);

    this.tweenJumpOut = new TWEEN.Tween(this.playerMesh.scale)
      .to(
        {
          x: this.playerMesh.scale.x,
          y: this.playerMesh.scale.y,
          z: this.playerMesh.scale.z,
        },
        250
      )
      .easing(TWEEN.Easing.Cubic.In);

    let rotY = THREE.MathUtils.degToRad(90);

    this.tweenRotate = new TWEEN.Tween(this.playerMesh.rotation)
      .to(
        {
          x: this.playerMesh.rotation.x,
          y: this.playerMesh.rotation.y + rotY,
          z: this.playerMesh.rotation.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quartic.Out);

    this.tweenMoveIntoZ = new TWEEN.Tween(this.playerMesh.position)
      .to(
        {
          x: this.playerMesh.position.x,
          y: this.playerMesh.position.y,
          z: this.playerMesh.position.z - 5,
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.InOut);

    this.tweenRotate.chain(this.tweenMoveIntoZ);
  }

  moveIntoPortfolioItem() {
    this.tweenRotate.start();
  }

  handleMovement() {
    if (!this.movingLeft && !this.movingRight) {
      this.currentMoveSpeed = 0;
      if (this.playerMesh.scale.x != 1) this.tweenScaleOut.start();
      return;
    }

    if (this.playerMesh.scale.x == 1) this.tweenScaleIn.start();

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
    this.originalScale = this.playerMesh.scale;
  }

  initializeBody() {
    const playerShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.5));
    this.playerBody = new CANNON.Body({ mass: 1 });
    this.playerBody.addShape(playerShape);
    this.playerBody.position.x = this.pos.x;
    this.playerBody.position.y = this.pos.y;
    this.playerBody.position.z = this.pos.z;
    this.playerBody.restitution = 0;
  }
}
