import * as THREE from "https://threejs.org/build/three.module.js";

const InputKeys = Object.freeze({
  Left: 65,
  Right: 68,
  Jump: 32,
  Fall: 83,
});

export default class Player extends THREE.Object3D {
  playerGFX;
  moveSpeed;

  constructor(playerGFX, moveSpeed) {
    super();
    this.playerGFX = playerGFX;
    this.moveSpeed = moveSpeed;
  }

  handleMovement(event) {
    let currentKey = event.which;

    switch (currentKey) {
      case InputKeys.Left:
        this.playerGFX.translateX(10);
        break;
      case InputKeys.Right:
        break;
    }
  }
}
