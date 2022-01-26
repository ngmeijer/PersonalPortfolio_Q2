import Cube from "../Cube.js";
import PortfolioItem from "../PortfolioItem.js";

export default class Portfolio {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;

  instructionTextColor = 0xe85d04;
  platformColor = 0x370617;
  environmentColor = 0x6a040f;

  portfolioItems = [];

  TestVar = 0;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;

    this.createPortfolioGeometry();
    this.createPortfolioText();
    this.createPortfolioItems();
    this.createLighting();
  }

  createPortfolioGeometry() {
    
  }

  createPortfolioText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;
    let textMesh;

    this.fontLoader.load(
      "../Fonts/Josefin_Sans_Regular.json",

      function (font) {
        const geometry = new THREE.TextGeometry(
          "Try climbing up the platforms!",
          { font: font, size: 0.4, height: 0.01 }
        );
        const textMesh = new THREE.Mesh(geometry, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        textMesh.position.x = 8.5;
        textMesh.position.y = -3.2;
        textMesh.position.z = -0.5;

        scene.add(textMesh);
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
      new THREE.Vector2(3.9, 2.3),
      new THREE.Vector3(3.7, 2.1),
      new THREE.Vector3(16, -1.3, 0),
      textCol,
      platformCol
    );

    const TWDE_Item2 = new PortfolioItem(
      "TDWE_Portfolio",
      "TDWE",
      new THREE.Vector2(3.9, 2.3),
      new THREE.Vector3(3.7, 2.1),
      new THREE.Vector3(22, -1.3, 0),
      textCol,
      platformCol
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE_Portfolio",
      "TDWE",
      new THREE.Vector2(3.9, 2.3),
      new THREE.Vector3(3.7, 2.1),
      new THREE.Vector3(28, -1.3, 0),
      textCol,
      platformCol
    );

    this.fontLoader.load(
      "../Fonts/Josefin_Sans_Regular.json",

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
    const light = new THREE.PointLight(0xffba08, 2, 30);
    light.position.set(25, 3, 1);
    light.castShadow = true;
    this.scene.add(light);
  }
}
