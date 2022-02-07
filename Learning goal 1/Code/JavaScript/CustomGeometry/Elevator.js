export default class Elevator extends THREE.Object3D {
  spineMesh;
  platformMesh;
  platformBody;
  colour;
  playerInstance;
  moveFloorUp;
  moveFloorDown;
  currentFloor = 0;
  maxFloors = 3;
  eventManager;
  animationPlaying = false;

  constructor(pPosition, pColour, pEventManager) {
    super();
    this.pos = pPosition;
    this.colour = pColour;
    this.eventManager = pEventManager;

    this.createSpine();
    this.createPlatform();
    this.initializeInputEvents(this, this.eventManager);
  }

  createSpine() {
    const geo = new THREE.BoxGeometry(0.5, 45, 2);
    const material = new THREE.MeshPhongMaterial({ color: this.colour });
    this.spineMesh = new THREE.Mesh(geo, material);
    this.spineMesh.position.x = this.pos.x;
    this.spineMesh.position.y = this.pos.y;
    this.spineMesh.position.z = this.pos.z;
  }

  createPlatform() {
    const geo = new THREE.BoxGeometry(3, 1, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x370617 });
    this.platformMesh = new THREE.Mesh(geo, material);
    this.platformMesh.position.x = this.pos.x;
    this.platformMesh.position.y = this.pos.y - 1;
    this.platformMesh.position.z = this.pos.z + 3;
    this.platformMesh.receiveShadow = true;
    this.platformMesh.castShadow = true;

    const platformShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
    this.platformBody = new CANNON.Body({ mass: this.mass });

    this.platformBody.addShape(platformShape);
    this.platformBody.position.x = this.platformMesh.position.x;
    this.platformBody.position.y = this.platformMesh.position.y;
    this.platformBody.position.z = this.platformMesh.position.z;
  }

  update() {
    this.checkPlayerDistance();
    this.updateTransform();
  }

  updateTransform() {
    this.platformMesh.position.set(
      this.platformBody.position.x,
      this.platformBody.position.y,
      this.platformBody.position.z
    );
    this.platformMesh.quaternion.set(
      this.platformBody.quaternion.x,
      this.platformBody.quaternion.y,
      this.platformBody.quaternion.z,
      this.platformBody.quaternion.w
    );
  }

  initializeInputEvents(pThis, pEventManager) {
    document.addEventListener("keydown", function (event) {
      if (event.key == "w" || event.key == "W") {
        pEventManager.dispatchEvent({ type: "Event_disableMove" });
        console.log("prssed w")
        pThis.checkDirection(1);
      }
      if (event.key == "s" || event.key == "S") {
        pThis.checkDirection(-1);
      }
    });
  }

  checkDirection(pDirection) {
    switch (pDirection) {
      case 1:
        this.moveFloorUp = true;
        this.moveFloorDown = false;
        break;
      case -1:
        this.moveFloorDown = true;
        this.moveFloorUp = false;
        break;
    }
  }

  checkPlayerDistance() {
    let distance = this.playerInstance.currentPos.distanceTo(
      this.platformMesh.position
    );

    if (this.animationPlaying) return;
    if (distance <= 1.5) {
      if (this.moveFloorUp && this.currentFloor < this.maxFloors) {
        this.startAscendingAnimation(this.eventManager);

        if (this.moveFloorDown && this.currentFloor > 0) {
          let targetPos = new THREE.Vector3(
            this.platformBody.position.x,
            this.platformBody.position.y - 6.5,
            this.platformBody.position.z
          );

          const tweenToFloorDown = new TWEEN.Tween(this.platformBody.position)
            .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 3000)
            .easing(TWEEN.Easing.Linear.None)
            .start();
          this.currentFloor--;
          this.moveFloorUp = false;
          this.moveFloorDown = false;
        }
      }
    }
  }

  startAscendingAnimation(pEventManager) {
    let targetPos = new THREE.Vector3(
      this.platformBody.position.x,
      this.platformBody.position.y + 6.5,
      this.platformBody.position.z
    );

    this.animationPlaying = true;

    const tweenToFloorUp = new TWEEN.Tween(this.platformBody.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 3000)
      .easing(TWEEN.Easing.Linear.None)
      .start()
      .onComplete(function () {
        pEventManager.dispatchEvent({ type: "Event_enableMove" });
        this.animationPlaying = false;
      });
      this.currentFloor++;
      this.moveFloorUp = false;
      this.moveFloorDown = false;
  }

  addToScene(pScene, pPhysicsWorld) {
    pScene.add(this.spineMesh);
    pScene.add(this.platformMesh);

    pPhysicsWorld.addBody(this.platformBody);
  }
}
