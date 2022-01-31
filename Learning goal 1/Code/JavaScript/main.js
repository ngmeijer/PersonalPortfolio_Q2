import MainScene from "./AreaClasses/Scenes/MainScene.js";
import TestScene from "./AreaClasses/Scenes/TestScene.js";

const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();
const mainScene = new MainScene(fontLoader, textureLoader);
const testScene = new TestScene(fontLoader, textureLoader);

let camera, renderer;

let fadeImage = document.getElementById("fadeImage");

let activeScene = mainScene;
let activePhysicsWorld;

let environmentColor = 0x100b13,
  instructionTextColor = 0x9d0208,
  platformColor = 0xe85d04;

document.addEventListener("keydown", function (event) {
  if (event.key == "f" || event.key == "F") {
    dimLighting();
  }
});

function createRenderingComponents() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 3, 8);

  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.antialias = true;
  document.body.appendChild(renderer.domElement);
}

function dimLighting() {
  var currentOpacity = { opacity: 0 };
  var fullOpacity = { opacity: 1 };
  var noOpacity = { opacity: 0 };
  var fadeOut = new TWEEN.Tween(currentOpacity)
    .to(fullOpacity, 2000)
    .onUpdate(function () {
      fadeImage.style.setProperty("opacity", currentOpacity.opacity);
    })
    .onComplete(function () {
      activeScene = testScene;
      activePhysicsWorld = testScene.physicsWorld;
      activeScene.playerInstance.resetPlayer();
    });

  var fadeIn = new TWEEN.Tween(currentOpacity)
    .to(noOpacity, 2000)
    .onUpdate(function () {
      fadeImage.style.setProperty("opacity", currentOpacity.opacity);
    });

  fadeOut.chain(fadeIn);

  fadeOut.start();
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let cameraOffset = new THREE.Vector3(1.5, 2, 0);
function cameraFollowPlayer() {
  camera.position.x =
    activeScene.playerInstance.playerBody.position.x + cameraOffset.x;
  camera.position.y =
  activeScene.playerInstance.playerBody.position.y + cameraOffset.y;
}

function initialize() {
  createRenderingComponents();
  mainScene.environmentColor = environmentColor;
  mainScene.instructionTextColor = instructionTextColor;
  mainScene.platformColor = platformColor;
  mainScene.initalizeScene();

  testScene.environmentColor = environmentColor;
  testScene.instructionTextColor = instructionTextColor;
  testScene.platformColor = platformColor;
  testScene.initalizeScene();

  activeScene = mainScene;
  activePhysicsWorld = mainScene.physicsWorld;
}

const frameClock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  activePhysicsWorld.step(delta);
  activeScene.update(delta);

  cameraFollowPlayer();

  TWEEN.update();
  render();
}

function render() {
  renderer.render(activeScene, camera);
}
initialize();
animate();
