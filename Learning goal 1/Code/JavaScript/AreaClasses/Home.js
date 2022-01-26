import Cube from "../Cube.js";

export default class Home {
  scene;
  physicsWorld;
  fontLoader;

  instructionTextColor = 0xe85d04;
  platformColor = 0x370617;
  environmentColor = 0x6a040f;

  constructor(pScene, pPhysicsWorld, pFontLoader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.fontLoader = pFontLoader;

    this.createStartGeometry();
    this.createStartText();
    this.createLighting();
  }

  createStartGeometry() {
    let stairStep1 = new Cube(
      "StairStep1",
      new THREE.Vector3(2, 1, 15),
      new THREE.Vector3(5, -6.5, 0),
      this.environmentColor,
      true,
      0
    );
    this.scene.add(stairStep1.mesh);
    this.physicsWorld.addBody(stairStep1.body);

    let stairStep2 = new Cube(
      "StairStep2",
      new THREE.Vector3(2, 2, 15),
      new THREE.Vector3(7, -6, 0),
      this.environmentColor,
      true,
      0
    );
    this.scene.add(stairStep2.mesh);
    this.physicsWorld.addBody(stairStep2.body);
  }

  createStartText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;

    this.fontLoader.load(
      "../Fonts/Josefin_Sans_Regular.json",

      function (font) {
        const geometry = new THREE.TextGeometry(
          "Press A/D to move horizontally!\nPress space to jump",
          { font: font, size: 0.4, height: 0.01 }
        );
        const textMesh = new THREE.Mesh(geometry, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        textMesh.position.x = -3.5;
        textMesh.position.y = -4;
        textMesh.position.z = -2;

        scene.add(textMesh);
      }
    );
  }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 10, 20);
    light.position.set(-7, 3, 1);
    light.castShadow = true;
    this.scene.add(light);
  }
}
