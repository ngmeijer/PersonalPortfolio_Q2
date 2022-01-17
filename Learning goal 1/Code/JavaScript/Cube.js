export default class Cube extends THREE.Object3D {
  cubePosition;
  size;
  isStatic;
  mass;
  cubeMesh;
  cubeBody;
  colour;

  constructor(pSize, pPosition, pColour, pIsStatic, pMass = 0) {
    super();
    this.cubePosition = pPosition;
    this.size = pSize;
    this.colour = pColour;
    this.isStatic = pIsStatic;
    this.mass = pMass;

    this.createGraphics();
    this.createBody();
  }

  update() {
    if(!this.isStatic) this.updateTransform();
  }

  updateTransform(){
    cubeMesh.position.set(
        cubeBody.position.x,
        cubeBody.position.y,
        cubeBody.position.z
      );
      cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
      );
  }

  createGraphics() {
    const cubeGeo = new THREE.BoxGeometry(
      this.size.x,
      this.size.y,
      this.size.z
    );
    const material = new THREE.MeshPhongMaterial({polygonOffset:true,
                                                  polygonOffsetFactor: -1.0,
                                                  polygonOffsetUnits: -4.0});
    material.color.setHex(this.colour);
    this.cubeMesh = new THREE.Mesh(cubeGeo, material);
    this.cubeMesh.position.x = this.cubePosition.x;
    this.cubeMesh.position.y = this.cubePosition.y;
    this.cubeMesh.position.z = this.cubePosition.z;
    this.cubeMesh.castShadow = true;
    this.cubeMesh.receiveShadow = true;
  }

  createBody() {
    const cubeShape = new CANNON.Box(
      new CANNON.Vec3(this.size.x / 2, this.size.y / 2, this.size.z / 2)
    );
    this.cubeBody = new CANNON.Body({ mass: 0 });

    this.cubeBody.addShape(cubeShape);
    this.cubeBody.position.x = this.cubeMesh.position.x;
    this.cubeBody.position.y = this.cubeMesh.position.y;
    this.cubeBody.position.z = this.cubeMesh.position.z;
  }
}
