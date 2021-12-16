import * as THREE from "https://threejs.org/build/three.module.js";

export default class PlayerController extends THREE.Object3D {
  player;
  moveSpeed;

  constructor(playerGFX, moveSpeed) {
    super();
    this.player = playerGFX;
    this.moveSpeed = moveSpeed;
  }

  handleMovement(direction){
    this.playerGFX.translateX(direction * this.moveSpeed);
  }
}