import Cube from "../Cube.js";

export default class AboutMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;

  door;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours(){
    
  }

  initialize(){
    this.createAboutMeArea();
    this.createLighting();
    this.openDoor();
  }

  update(){

  }

  openDoor(){
    const doorOpenTween = new TWEEN.Tween({x: 0, y: 0, z: 20}).to({x: 0, y: 5, z: 20}, 2000);

    doorOpenTween.onUpdate(function (object: {
      x: number;
      y: number;
      z: number;
    }, elapsed:number){
      this.door.mesh.position.set(object.x, object.y, object.z);
    });
    doorOpenTween.start();
  }

  createAboutMeArea() {
    this.door = new Cube(
      "BlueDoor",
      new THREE.Vector3(1, 25, 20),
      new THREE.Vector3(33, 4, 0),
      0x9D0208,
      true,
      0
    );
    this.scene.add(this.door.mesh);
    this.physicsWorld.addBody(this.door.body);
    }

  createLighting() {
    const light = new THREE.PointLight(0xffba08, 10, 20);
    light.position.set(35, 7, 0);
    light.castShadow = true;
    this.scene.add(light);
  }
}
