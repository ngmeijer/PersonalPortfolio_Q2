export default class Plane extends THREE.Object3D {
  planePosition;
  size;
  planeMesh;
  planeBody;
  colour;
    
  constructor(pSize, pPosition, pColour) {
    super();
    this.planePosition = pPosition;
    this.size = pSize;
    this.colour = pColour;

    this.createGraphics();
    this.createBody();
  }

  createGraphics() {
    const planeGeometry = new THREE.PlaneGeometry(40, 10);
    let material = new THREE.MeshPhongMaterial();
    material.color.setHex(this.colour);
    this.planeMesh = new THREE.Mesh(planeGeometry, material);
    this.planeMesh.rotateX(-Math.PI / 2);
    this.planeMesh.receiveShadow = true;
    this.planeMesh.position.y = -7;
  }

  createBody() {
    const planeShape = new CANNON.Plane();
    this.planeBody = new CANNON.Body({ mass: 0 });
    this.planeBody.position.y = this.planeMesh.position.y;
    this.planeBody.addShape(planeShape);
    this.planeBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
  }
}
