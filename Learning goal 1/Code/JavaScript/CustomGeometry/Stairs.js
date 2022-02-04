export default class Stairs extends THREE.Object3D {
  ID;
  pos;
  size;
  body;
  colour;
  stepCount;
  stepDepth;
  group;

  constructor(pID, pSize, pPosition, pColour, pStepCount, pStepDepth) {
    super();
    this.ID = pID;
    this.pos = pPosition;
    this.size = pSize;
    this.colour = pColour;

    this.stepCount = pStepCount;
    this.group = new THREE.Group();

    this.setOriginToBottom();
    this.createGraphics();
  }

  setOriginToBottom() {
    this.pos.y += this.size.y / 2;
  }

  createGraphics() {
    const material = new THREE.MeshPhongMaterial({
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0,
    });
    material.color.setHex(this.colour);

    for (let i = 0; i < this.stepCount; i++) {
      let normalizedIndex = i / this.stepCount;
      const cubeGeo = new THREE.BoxGeometry(
        this.stepDepth,
        this.size.y,
        this.size.z
      );

      const mesh = new THREE.Mesh(cubeGeo, material);
      mesh.position.x = this.pos.x + normalizedIndex * this.size.x;
      mesh.position.y = this.pos.y + normalizedIndex * 1;
      mesh.position.z = this.pos.z;
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.group.add(mesh);
    }
  }

  addToScene(pScene) {
    pScene.add(this.group);
  }
}
