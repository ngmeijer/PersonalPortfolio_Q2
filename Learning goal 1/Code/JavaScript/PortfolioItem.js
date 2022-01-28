import Cube from "./Cube.js";

export default class PortfolioItem extends THREE.Object3D {
  ID;
  itemPosition;
  outerSize;
  meshLeft;
  meshRight;
  meshTop;
  meshBottom;
  platform;
  textColour;
  platformColour;
  image;
  imageFileName;
  imageOffset;
  textureLoader;
  textMesh;

  verticalWallWidth;
  verticalWallHeight;

  horizontalWallWidth;
  horizontalWallHeight;

  shouldCreatePlatform;

  constructor(
    pID,
    pImageFileName,
    pOuterSize,
    pInnerSize,
    pPosition,
    pTextColour,
    pPlatformColour,
    pCreatePlatform = true
  ) {
    super();
    this.ID = pID;
    this.imageFileName = pImageFileName;
    this.itemPosition = pPosition;
    this.outerSize = pOuterSize;
    this.innerSize = pInnerSize;
    this.textColour = pTextColour;
    this.platformColour = pPlatformColour;
    this.shouldCreatePlatform = pCreatePlatform;

    this.imageOffset = new THREE.Vector3(0, 0, -0.5);

    this.createFrame();
    if (this.shouldCreatePlatform) this.createPlatform();
  }

  createFrame() {
    //Vertical walls = left & right;
    //Horizontal walls = top & bottom;
    this.verticalWallWidth = this.outerSize.x - this.innerSize.x;
    this.verticalWallHeight = this.outerSize.y;

    this.horizontalWallHeight = this.outerSize.y - this.innerSize.y;

    const cubeGeoLeft = new THREE.BoxGeometry(
      this.verticalWallWidth,
      this.verticalWallHeight,
      0.2
    );
    const cubeGeoRight = cubeGeoLeft;

    const cubeGeoTop = new THREE.BoxGeometry(
      this.outerSize.x,
      this.horizontalWallHeight,
      0.2
    );

    const material = new THREE.MeshPhongMaterial({
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0,
    });
    material.color.setHex(this.platformColour);

    this.meshLeft = new THREE.Mesh(cubeGeoLeft, material);
    this.meshRight = new THREE.Mesh(cubeGeoRight, material);
    this.meshTop = new THREE.Mesh(cubeGeoTop, material);

    this.meshLeft.position.x = this.itemPosition.x - this.outerSize.x / 2 + this.verticalWallWidth / 2;;
    this.meshLeft.position.y = this.itemPosition.y;
    this.meshLeft.position.z = this.itemPosition.z + this.imageOffset.z;

    this.meshRight.position.x = this.itemPosition.x + this.outerSize.x / 2 + this.verticalWallWidth / 2;
    this.meshRight.position.y = this.itemPosition.y;
    this.meshRight.position.z = this.itemPosition.z + this.imageOffset.z;

    this.meshTop.position.x = this.itemPosition.x;
    this.meshTop.position.y =
      this.itemPosition.y +
      this.outerSize.y / 2 -
      this.horizontalWallHeight / 2;
    this.meshTop.position.z = this.itemPosition.z + this.imageOffset.z;

    this.meshLeft.castShadow = false;
    this.meshLeft.receiveShadow = true;

    this.meshRight.castShadow = false;
    this.meshRight.receiveShadow = true;

    this.meshTop.castShadow = false;
    this.meshTop.receiveShadow = true;
  }

  createImage(textureLoader) {
    const geo = new THREE.PlaneBufferGeometry(
      this.innerSize.x,
      this.innerSize.y
    );
    const material = new THREE.MeshBasicMaterial({
      map: textureLoader.load(`../Images/` + this.imageFileName + ".png"),
    });

    this.image = new THREE.Mesh(geo, material);

    this.image.position.x = this.itemPosition.x;
    this.image.position.y = this.itemPosition.y;
    this.image.position.z = this.itemPosition.z + this.imageOffset.z;
  }

  createPlatform() {
    this.platform = new Cube(
      this.ID + "_Platform",
      new THREE.Vector3(this.outerSize.x + 0.1 * this.outerSize.x, 0.15, 1),
      new THREE.Vector3(
        this.itemPosition.x,
        this.itemPosition.y - 1.15,
        this.itemPosition.z
      ),
      this.platformColour,
      true,
      0
    );

    this.platform.mesh.castShadow = false;
  }

  createText(pFont) {
    const geometry = new THREE.TextGeometry("Press F", {
      font: pFont,
      size: 0.4,
      height: 0.01,
    });
    this.textMesh = new THREE.Mesh(geometry, [
      new THREE.MeshPhongMaterial({ color: 0xad4000 }),
      new THREE.MeshPhongMaterial({ color: 0x5c2301 }),
    ]);

    this.textMesh.position.x = this.itemPosition.x;
    this.textMesh.position.y = this.itemPosition.y;
    this.textMesh.position.z = this.itemPosition.z;
  }

  checkPlayerOnPlatform(pPlayerDistance, pPlayerY){
    if(pPlayerDistance < 1 && pPlayerY >= this.platform.position.y){
      console.log("Standing on platform.");
    }
  }

  addToScene(pScene, pPhysicsWorld) {
    pScene.add(this.meshLeft);
    pScene.add(this.meshRight);
    pScene.add(this.meshTop);

    if (this.shouldCreatePlatform) pScene.add(this.platform.mesh);
    if (this.shouldCreatePlatform) pPhysicsWorld.addBody(this.platform.body);

    pScene.add(this.image);

    //pScene.add(this.textMesh);
  }
}