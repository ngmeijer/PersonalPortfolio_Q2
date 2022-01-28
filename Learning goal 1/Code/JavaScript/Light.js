export default class Light extends THREE.Object3D {
  lightComp;
  constructor(pLightType, pPosition, pIntensity, pRange, pColour) {
    super();
    switch (pLightType) {
      case "PointLight":
        this.lightComp = new THREE.PointLight();
        break;
      case "DirectionalLight":
        this.lightComp = new THREE.DirectionalLight();
        break;
      default:
        console.log("{ " + pLightType + " }" + " is not a valid light type.");
        return;
    }

    this.lightComp.intensity = pIntensity;
    this.lightComp.distance = pRange;
    this.lightComp.color = pColour;

    this.lightComp.position.set(pPosition.x, pPosition.y, pPosition.z);
    this.lightComp.castShadow = true;
    console.log(this.lightComp.distance);
  }
}
