import Cube from "../Cube.js";

export default class Door extends THREE.Object3D {
  ID;
  pos;
  size;
  colour;
  doorGFX_Body;
  verticalMovement = 5;
  isOpen = false;
  isClosed = true;
  originalPosition;

  constructor(pID, pSize, pPosition, pColour) {
    super();
    this.ID = pID;
    this.pos = pPosition;
    this.size = pSize;
    this.colour = pColour;

    this.doorGFX_Body = new Cube(
      "AboutMeDoor",
      new THREE.Vector3(1, 5, 20),
      new THREE.Vector3(33, 5.5, 0),
      0x9d0208,
      true,
      0
    );

    this.originalPosition = this.pos;
  }

  update() {
    this.doorGFX_Body.update();
  }

  openDoor() {
    let targetPos = new THREE.Vector3(
      this.doorGFX_Body.body.position.x,
      10,
      this.doorGFX_Body.body.position.z
    );

    const tweenOpen = new TWEEN.Tween(this.doorGFX_Body.body.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 1000)
      .start();

    this.isOpen = true;
  }
 
  closeDoor() {
    let targetPos = new THREE.Vector3(
      this.doorGFX_Body.body.position.x,
      10,
      this.doorGFX_Body.body.position.z
    );

    const tweenClose = new TWEEN.Tween(this.doorGFX_Body.body.position)
      .to({ x: this.originalPosition.x, y: this.originalPosition.y, z: this.originalPosition.z }, 1000)
      .start();

    this.isOpen = false;
  }
}
