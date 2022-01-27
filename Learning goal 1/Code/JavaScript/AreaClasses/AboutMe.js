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
    this.createDoor();
    this.createLighting();
    this.creatAboutMeText();
    this.createAboutMeGeometry();
  }

  createDoor() {
    this.door = new Door(
      "BlueDoor",
      new THREE.Vector3(1, 25, 20),
      new THREE.Vector3(33.5, 4, 0),
      0x9d0208,
      true
    );

    this.scene.add(this.door.doorGFX_Body.mesh);
    this.physicsWorld.addBody(this.door.doorGFX_Body.body);
  }

  createAboutMeGeometry() {
    let background = new Cube(
      "AboutMe_Background",
      new THREE.Vector3(26, 20, 10),
      new THREE.Vector3(45, 1, -12),
      this.environmentColor,
      true,
      0
    );

    background.addToScene(this.scene, this.physicsWorld);

    let backgroundLeft = new Cube(
      "AboutMe_BackgroundLeft",
      new THREE.Vector3(1, 20, 10),
      new THREE.Vector3(7.5, 1, -6.5),
      this.environmentColor,
      true,
      0
    );

    backgroundLeft.addToScene(this.scene, this.physicsWorld);
  }

  creatAboutMeText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;
    let textMesh;

    this.fontLoader.load(
      "../Fonts/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const titleGeo = new THREE.TextGeometry(
          "About me",
          { font: font, size: 0.7, height: 0.01 }
        );
        const titleMesh = new THREE.Mesh(titleGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        titleMesh.position.x = 37;
        titleMesh.position.y = 9;
        titleMesh.position.z = -6.5;
        titleMesh.castShadow = true;
        scene.add(titleMesh);
      }
    );
  }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 5, 30);
    light.position.set(50, 7, 0);
    light.castShadow = true;
    this.scene.add(light);
  }
}
