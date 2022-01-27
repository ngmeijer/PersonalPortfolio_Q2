import Cube from "../Cube.js";
import PortfolioItem from "../PortfolioItem.js";

export default class Portfolio {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;

  instructionTextColor;
  platformColor;
  environmentColor;

  portfolioItems = [];

  TestVar = 0;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours(){
    
  }

  initialize(){
    this.createPortfolioGeometry();
    this.createPortfolioText();
    this.createPortfolioItems();
    this.createLighting();
  }

  createPortfolioGeometry() {
    let stepItem1 = new Cube(
      "P_StepItem1",
      new THREE.Vector3(2, 1.25, 10),
      new THREE.Vector3(19, 3.75, 0),
      this.environmentColor,
      true,
      0
    );

    //stepItem1.addToScene(this.scene, this.physicsWorld);
  }

  createPortfolioText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;
    let textMesh;

    this.fontLoader.load(
      "../Fonts/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const hintGeo = new THREE.TextGeometry(
          "Try climbing up the platforms!",
          { font: font, size: 0.4, height: 0.01 }
        );
        const hintMesh = new THREE.Mesh(hintGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        hintMesh.position.x = 8.5;
        hintMesh.position.y = 3.3;
        hintMesh.position.z = -1.5;
        hintMesh.castShadow = true;
        scene.add(hintMesh);

        const titleGeo = new THREE.TextGeometry(
          "Portfolio",
          { font: font, size: 0.4, height: 0.01 }
        );
        const titleMesh = new THREE.Mesh(titleGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        titleMesh.position.x = 8.5;
        titleMesh.position.y = 9;
        titleMesh.position.z = -1.5;
        titleMesh.castShadow = true;
        scene.add(titleMesh);
      }
    );
  }

  createPortfolioItems() {
    let textCol = this.instructionTextColor;
    let platformCol = this.platformColor;
    let textureLoader = this.textureLoader;

    const TWDE_Item = new PortfolioItem(
      "TDWE_Portfolio",
      "TDWE",
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(15, 7, 0),
      textCol,
      platformCol
    );

    const TWDE_Item2 = new PortfolioItem(
      "TDWE_Portfolio",
      "TDWE",
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(20, 8.7, 0),
      textCol,
      platformCol
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE_Portfolio",
      "TDWE",
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(25, 7, 0),
      textCol,
      platformCol,
    );

    this.fontLoader.load(
      "../Fonts/Josefin_Sans_SemiBold_Regular.json",

      function (font) {
        TWDE_Item.createText(font);
        TWDE_Item2.createText(font);
      }
    );

    TWDE_Item.createImage(textureLoader);
    TWDE_Item.addToScene(this.scene, this.physicsWorld);
    this.portfolioItems.push(TWDE_Item);

    TWDE_Item2.createImage(textureLoader);
    TWDE_Item2.addToScene(this.scene, this.physicsWorld);
    this.portfolioItems.push(TWDE_Item2);

    TWDE_Item3.createImage(textureLoader);
    TWDE_Item3.addToScene(this.scene, this.physicsWorld);
    this.portfolioItems.push(TWDE_Item3);
  }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 10, 15);
    light.position.set(25, 12, 5);
    light.castShadow = true;
    this.scene.add(light);
  }
}
