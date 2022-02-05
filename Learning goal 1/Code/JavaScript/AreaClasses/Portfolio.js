import Cube from "../CustomGeometry/Cube.js";
import PortfolioItem from "../PortfolioItem.js";

export default class Portfolio {
  mainScene;
  physicsWorld;
  textureLoader;
  fontLoader;

  playerInstance;

  instructionTextColor;
  platformColor;
  environmentColor;

  portfolioItems = [];
  itemScenes = [];
  itemPhysicsWorlds = [];
  light;

  canEnterItem;
  nearestItemName;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.mainScene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours() {}

  initializeArea() {
    this.createPortfolioGeometry();
    this.createPortfolioText();
    this.createPortfolioItems();
    this.createLighting();
  }

  update() {
    this.canEnterItem = false;
    for (let i = 0; i < this.portfolioItems.length; i++) {
      if (this.portfolioItems[i].checkPlayerOnPlatform()){
        this.canEnterItem = true;
      }
    }
  }

  createPortfolioGeometry() {
    let ground = new Cube(
      "Portfolio_Ground",
      new THREE.Vector3(50, 1, 50),
      new THREE.Vector3(31, -1.5, -10),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.mainScene, this.physicsWorld);

    let backgroundLeft = new Cube(
      "Portfolio_BackgroundLeft",
      new THREE.Vector3(1, 20, 30),
      new THREE.Vector3(6.5, -0.5, -16),
      this.environmentColor,
      true,
      0
    );

    backgroundLeft.addToScene(this.mainScene, this.physicsWorld);
  }

  createPortfolioText() {
    let scene = this.mainScene;
    let textCol = this.instructionTextColor;
    let textMesh;

    this.fontLoader.load(
      "../Fonts/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const titleGeo = new THREE.TextGeometry("Portfolio", {
          font: font,
          size: 0.7,
          height: 0.01,
        });
        const titleMesh = new THREE.Mesh(titleGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        titleMesh.position.x = 7;
        titleMesh.position.y = 3;
        titleMesh.position.z = -1;
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
      new THREE.Vector3(12, 0.8, 0),
      textCol,
      platformCol
    );

    const TWDE_Item2 = new PortfolioItem(
      "TDWE_Portfolio2",
      "TDWE",
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(18, 0.8, 0),
      textCol,
      platformCol
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE_Portfolio3",
      "TDWE",
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(24, 0.8, 0),
      textCol,
      platformCol
    );

    this.fontLoader.load(
      "../Fonts/Josefin_Sans_SemiBold_Regular.json",

      function (font) {
        TWDE_Item.createText(font);
        TWDE_Item2.createText(font);
      }
    );

    TWDE_Item.createImage(textureLoader);
    TWDE_Item.addToScene(this.mainScene, this.physicsWorld);
    TWDE_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item);

    TWDE_Item2.createImage(textureLoader);
    TWDE_Item2.addToScene(this.mainScene, this.physicsWorld);
    TWDE_Item2.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item2);

    TWDE_Item3.createImage(textureLoader);
    TWDE_Item3.addToScene(this.mainScene, this.physicsWorld);
    TWDE_Item3.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item3);
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 4, 60);
    this.light.position.set(15, 2, 0);
    this.light.castShadow = true;
    this.mainScene.add(this.light);
  }
}
