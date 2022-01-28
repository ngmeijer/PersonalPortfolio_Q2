export default class ContactMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;
  light;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours() {}

  initializeArea() {
    this.createContactMeArea();
    this.createLighting();
    this.createText();
  }

  update(){
    
  }

  createContactMeArea() {

  }

  createText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;

    this.fontLoader.load(
      "../Fonts/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const titleGeo = new THREE.TextGeometry(
          "Contact me",
          { font: font, size: 0.7, height: 0.01 }
        );
        const titleMesh = new THREE.Mesh(titleGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        titleMesh.position.x = 55;
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
    this.light = new THREE.PointLight(0xffba08, 10, 20);
    this.light.position.set(75, 7, 0);
    this.light.castShadow = true;
    this.scene.add(this.light);
  }
}
