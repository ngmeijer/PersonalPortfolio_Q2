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
  }

  overrideColours(){
    
  }

  initialize(){
    this.createStartGeometry();
    this.createStartText();
    this.createLighting();
  }

  createStartGeometry() {
    let wall = new Cube(
      "LeftWall",
      new THREE.Vector3(2, 20, 50),
      new THREE.Vector3(-8, 0, 0),
      this.environmentColor,
      true,
      0
    );
    wall.addToScene(this.scene, this.physicsWorld);

    let stairStep1 = new Cube(
      "StairStep1",
      new THREE.Vector3(2, 1, 15),
      new THREE.Vector3(5, 0, 0),
      this.environmentColor,
      true,
      0
    );
    stairStep1.addToScene(this.scene, this.physicsWorld);

    let stairStep2 = new Cube(
      "StairStep2",
      new THREE.Vector3(2, 2, 15),
      new THREE.Vector3(7, 0.5, 0),
      this.environmentColor,
      true,
      0
    );
    stairStep2.addToScene(this.scene, this.physicsWorld);
  }

  createStartText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;

    this.fontLoader.load(
      "../Fonts/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const titleGeo = new THREE.TextGeometry(
          "Home",
          { font: font, size: 0.7, height: 0.01 }
        );
        const titleMesh = new THREE.Mesh(titleGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        titleMesh.position.x = -7;
        titleMesh.position.y = 7;
        titleMesh.position.z = -6;
        titleMesh.castShadow = true;
        scene.add(titleMesh);

        const hintGeo = new THREE.TextGeometry(
          "Press A/D to move!\nPress space to jump",
          { font: font, size: 0.4, height: 0.01 }
        );
        const hintMesh = new THREE.Mesh(hintGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        hintMesh.position.x = -7;
        hintMesh.position.y = 1;
        hintMesh.position.z = -6;
        hintMesh.castShadow = true;
        scene.add(hintMesh);
      }
    );
  }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 10, 20);
    light.position.set(0, 7, 0);
    light.castShadow = true;
    this.scene.add(light);
  }
}
