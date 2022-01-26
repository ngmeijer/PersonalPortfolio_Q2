import Cube from "../Cube.js";

export default class AboutMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;

    this.createAboutMeArea();
  }

  createAboutMeArea() {
    let door = new Cube(
      "BlueDoor",
      new THREE.Vector3(1, 5, 3),
      new THREE.Vector3(38, -1.5, 0),
      0x000e5b,
      true,
      0
    );
    this.scene.add(door.mesh);
    this.physicsWorld.addBody(door.body);
  }
}
