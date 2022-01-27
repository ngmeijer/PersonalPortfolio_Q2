import Cube from "../Cube.js";
import Door from "./Door.js";

export default class AboutMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;

  door;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours() {}

  initialize() {
    this.createAboutMeArea();
    this.createLighting();
  }

  createAboutMeArea() {
    this.door = new Door(
      "BlueDoor",
      new THREE.Vector3(0.1, 5, 20),
      new THREE.Vector3(33, 4.5, 0),
      0x9d0208,
      true
    );

    this.scene.add(this.door.doorGFX_Body.mesh);
    this.physicsWorld.addBody(this.door.doorGFX_Body.body);
  }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 10, 20);
    light.position.set(35, 7, 0);
    light.castShadow = true;
    this.scene.add(light);
  }
}
