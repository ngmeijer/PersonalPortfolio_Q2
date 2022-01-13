export default class Player extends THREE.Object3D {
  playerMesh;
  playerBody;
  playerPosition;
  defaultMoveSpeed;
  currentMoveSpeed;
  jumpForce;
  movingLeft;
  movingRight;
  canMove;
  delta;
  light;
  lightOffset = new THREE.Vector3(1, 5, 3);

  constructor(pMoveSpeed, pJumpForce) {
    super();
    this.initializeGFX();
    this.initializeBody();
    this.initializeLight();
    this.defaultMoveSpeed = pMoveSpeed;
    this.currentMoveSpeed = 0;
    this.jumpForce = pJumpForce;
    this.jumpDeltaPerFrame = this.jumpForce / this.framesToJump;
    this.playerMesh.position.x = 0;
    this.playerMesh.position.y = 3;
    this.movingLeft = false;
    this.movingRight = false;
  }

  update(delta) {
    this.delta = delta;
    this.handleMovement();

    this.playerPosition = this.playerBody.position;
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

    this.light.position.set(
      this.playerBody.position.x + this.lightOffset.x,
      this.playerBody.position.y + this.lightOffset.y,
      this.playerBody.position.z + this.lightOffset.z
    );
  }

  handleMovement() {
    if(this.movingLeft && this.movingRight) 
    {
      this.canMove = false;
      return;
    }

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
    if (this.playerBody.velocity.y > -0.2 && this.playerBody.velocity.y < 0.2)
      this.playerBody.velocity.y = this.jumpForce;
  }

  initializeLight() {
    this.light = new THREE.PointLight();
    this.light.angle = 180;
    this.light.intensity = 2;
    this.light.castShadow = true;
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 1);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.roughness = 0.5;
    playerMat.metalness = 0.5;
    playerMat.color.setHex(0x2305fd);
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.playerMesh.castShadow = true;
    this.playerMesh.receiveShadow = true;
    this.add(this.playerMesh);
  }

  initializeBody() {
    const playerShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.5));
    this.playerBody = new CANNON.Body({ mass: 1 });
    this.playerBody.addShape(playerShape);
    this.playerBody.position.x = this.playerMesh.position.x;
    this.playerBody.position.y = this.playerMesh.position.y;
    this.playerBody.position.z = this.playerMesh.position.z;
    this.playerBody.restitution = 0;
  }
}
