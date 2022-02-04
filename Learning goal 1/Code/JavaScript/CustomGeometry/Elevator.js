export default class Elevator extends THREE.Object3D {
  spineMesh;
  platformMesh;
  platformBody;
  colour;
  playerInstance;

  constructor(pPosition, pColour) {
    super();
    this.pos = pPosition;
    this.colour = pColour;

    this.createSpine();
    this.createPlatform();
  }

  createSpine() {
    const geo = new THREE.BoxGeometry(0.5, 25, 2);
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

  checkPlayerDistance(pPlayer) {
    let distance = pPlayer.currentPos.distanceTo(
      this.platformMesh.position
    );
    console.log(distance);
  }

  addToScene(pScene, pPhysicsWorld) {
    pScene.add(this.spineMesh);
    pScene.add(this.platformMesh);

    pPhysicsWorld.addBody(this.platformBody);
  }
}
