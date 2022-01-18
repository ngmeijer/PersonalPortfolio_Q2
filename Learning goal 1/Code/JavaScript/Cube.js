export default class Cube extends THREE.Object3D {
  ID;
  cubePosition;
  size;
  isStatic;
  mass;
  cubeMesh;
  cubeBody;
  colour;
  physicsMat;
  contactMat;
  friction;
  restitution;

  constructor(pID, pSize, pPosition, pColour, pIsStatic, pMass = 0.0, pPhysicsMat = null, pFriction = 0.0, pRestitution = 0.0) {
    super();
    this.ID = pID;
    this.cubePosition = pPosition;
    this.size = pSize;
    this.colour = pColour;
    this.isStatic = pIsStatic;
    this.mass = pMass;
    this.physicsMat = pPhysicsMat;
    this.friction = pFriction;
    this.restitution = pRestitution;

    if(this.isStatic && this.mass != 0) console.log("Object '" + this.ID + "' is set to static but mass is " + this.mass)
    if(!this.isStatic && this.mass == 0) console.log("Object '" + this.ID + "'s mass is set to 0 but is set to static.")

    this.createGraphics();
    this.createBody();
    this.createPhysicsMaterial();
  }

  update() {
    this.updateTransform();
  }

  updateTransform() {
    this.cubeMesh.position.set(
      this.cubeBody.position.x,
      this.cubeBody.position.y,
      this.cubeBody.position.z
    );
    this.cubeMesh.quaternion.set(
      this.cubeBody.quaternion.x,
      this.cubeBody.quaternion.y,
      this.cubeBody.quaternion.z,
      this.cubeBody.quaternion.w
    );
  }

  createGraphics() {
    const cubeGeo = new THREE.BoxGeometry(
      this.size.x,
      this.size.y,
      this.size.z
    );
    const material = new THREE.MeshPhongMaterial({
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0,
    });
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
    this.cubeBody = new CANNON.Body({ mass: this.mass });

    this.cubeBody.addShape(cubeShape);
    this.cubeBody.position.x = this.cubeMesh.position.x;
    this.cubeBody.position.y = this.cubeMesh.position.y;
    this.cubeBody.position.z = this.cubeMesh.position.z;
  }

  createPhysicsMaterial(){
    if(this.physicsMat == null) {
      console.log("No physics material assigned for object: " + this.ID + " (not required)");
      return;
    };

    this.contactMat = new CANNON.ContactMaterial(this.physicsMat, this.physicsMat, { friction: this.friction, restitution: this.restitution });
    console.log("Created contact material for object: " + this.ID + ". Restitution = " + this.restitution + ". Friction = " + this.friction);
  }
}