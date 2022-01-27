export default class ContactMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours() {}

  initialize() {
    //this.createContactMeArea();
    this.createLighting();
  }

  createContactMeArea() {
    let door = new Cube(
      "BlueDoor",
      new THREE.Vector3(1, 5, 3),
      new THREE.Vector3(25, -1.5, 0),
      0x000e5b,
      true,
      0
    );
    this.scene.add(door.mesh);
    this.physicsWorld.addBody(door.body);
  }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 10, 20);
    light.position.set(50, 7, 0);
    light.castShadow = true;
    this.scene.add(light);
  }
}
