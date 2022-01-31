export default class TDWE_Scene extends THREE.Scene {
  light;

  constructor() {
    super();
    this.initalizeScene();
  }

  initalizeScene() {
    this.createLighting();
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 50, 20);
    this.light.position.set(0, 7, 0);
    this.light.castShadow = true;
    this.add(this.light);
  }
}
