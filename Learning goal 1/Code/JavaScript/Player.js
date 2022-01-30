export default class Player extends THREE.Object3D {
  playerMesh;
  playerBody;
  noseMesh;
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
  tweenMoveLeft;
  tweenMoveRight;
  tweenMoveIntoZ;
  originalScale;
  currentScale;

  movingLeftRotation = 3.14159;
  movingRightRotation = 0;
  movingInRotation = 1.5708;

  facingLeft;
  facingRight = true;
  canMove = true;
  group;

  constructor(pMoveSpeed, pJumpForce, pPosition) {
    super();
    this.defaultMoveSpeed = pMoveSpeed;
    this.pos = pPosition;

    this.initializeGFX();
    this.initializeBody();

    this.currentMoveSpeed = 0;
    this.jumpForce = pJumpForce;
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
    this.group.position.set(
      this.playerBody.position.x,
      this.playerBody.position.y,
      this.playerBody.position.z
    );
    // this.group.quaternion.set(
    //   this.playerBody.quaternion.x,
    //   this.playerBody.quaternion.y,
    //   this.playerBody.quaternion.z,
    //   this.playerBody.quaternion.w
    // );

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

    this.tweenRotate = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.group.rotation.y + this.movingInRotation,
          z: this.group.rotation.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quartic.Out);

    this.tweenMoveLeft = new TWEEN.Tween(this.group.rotation, this.playerBody.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.group.rotation.y + this.movingLeftRotation,
          z: this.group.rotation.z,
        },
        500
      )
      .easing(TWEEN.Easing.Quartic.Out)

    this.tweenMoveRight = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.movingRightRotation,
          z: this.group.rotation.z,
        },
        500
      )
      .easing(TWEEN.Easing.Quartic.Out);

  }

  moveIntoPortfolioItem() {
    this.canMove = false;

    //Since Tweens cannot get updated during runtime (as far as I've found), I'll have to create a new one every time I have to play the animation
    this.tweenMoveIntoZ = new TWEEN.Tween(this.group.position)
      .to(
        {
          x: this.group.position.x,
          y: this.group.position.y,
          z: this.group.position.z - 2,
        },
        1000
      )
      .easing(TWEEN.Easing.Quadratic.InOut);

    this.tweenRotate.chain(this.tweenMoveIntoZ);

    this.tweenRotate.start();
  }

  handleMovement() {
    if(!this.canMove) return;
    if (!this.movingLeft && !this.movingRight) {
      this.currentMoveSpeed = 0;
      return;
    }

    if (this.movingLeft || this.movingRight)
      this.currentMoveSpeed = this.defaultMoveSpeed;

    if (this.movingLeft) {
      if (this.facingRight) this.tweenMoveLeft.start();
      this.movingRight = false;
      this.playerBody.position.x =
        this.playerBody.position.x - this.currentMoveSpeed * this.delta;
      this.hasPlayedLeftAnimation = true;
      this.facingRight = false;
    }
    if (this.movingRight) {
      if (!this.facingRight) this.tweenMoveRight.start();
      this.movingLeft = false;
      this.playerBody.position.x =
        this.playerBody.position.x + this.currentMoveSpeed * this.delta;
      this.facingRight = true;
    }
  }

  handleJump() {
    if (this.velocity.y > -0.2 && this.velocity.y < 0.2) {
      this.velocity.y = this.jumpForce;
      this.isJumping = true;
    } else this.isJumping = false;
  }

  initializeGFX() {
    this.group = new THREE.Group();

    const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0xf48c06);
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.playerMesh.castShadow = true;
    this.playerMesh.receiveShadow = true;
    this.originalScale = this.playerMesh.scale;

    const noseGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const noseMat = new THREE.MeshStandardMaterial();
    noseMat.color.setHex(0xff00000);
    this.noseMesh = new THREE.Mesh(noseGeo, noseMat);

    this.playerMesh.add(this.noseMesh);
    this.noseMesh.position.x += 0.3;
    this.group.add(this.playerMesh);
    //this.group.add(this.noseMesh);
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
