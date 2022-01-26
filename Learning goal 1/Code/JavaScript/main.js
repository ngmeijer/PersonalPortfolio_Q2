import Cube from "./Cube.js";
import Plane from "./Plane.js";
import Player from "./Player.js";

import Home from "./AreaClasses/Home.js";
import Portfolio from "./AreaClasses/Portfolio.js";
import AboutMe from "./AreaClasses/AboutMe.js";
import ContactMe from "./AreaClasses/ContactMe.js";

const scene = new THREE.Scene();
const physicsWorld = new CANNON.World();
const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();

physicsWorld.gravity.set(0, -12, 0);
let moveableObjects = [];

let playerInstance;
let moveDirection = 0;
let camera, renderer;

let environmentColor = 0x6a040f;


function createRenderingComponents() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, -2, 8);

  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  document.body.appendChild(renderer.domElement);
}

function createPlayer() {
  playerInstance = new Player(4, 7, new THREE.Vector3(-4, 0, 0));
  physicsWorld.addBody(playerInstance.playerBody);
  scene.add(playerInstance.playerMesh);

  document.addEventListener("keydown", function (event) {
    if (event.key == "a" || event.key == "A") {
      playerInstance.movingLeft = true;
      moveDirection = -1;
    }
    if (event.key == "d" || event.key == "D") {
      playerInstance.movingRight = true;
      moveDirection = 1;
    }
  });
  document.addEventListener("keyup", function (event) {
    if (event.key == "a" || event.key == "A") {
      playerInstance.movingLeft = false;
      moveDirection = 0;
    }
    if (event.key == "d" || event.key == "D") {
      playerInstance.movingRight = false;
      moveDirection = 0;
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key == " ") {
      playerInstance.handleJump();
    }
  });
}

function createGeneralGeometry(){
  let ground = new Plane(
    new THREE.Vector2(40, 100),
    new THREE.Vector3(0, -7, 0),
    new THREE.Vector3(-90, 0, 0),
    0x100b13,
    true
  );
  scene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);

  let background = new Plane(
    new THREE.Vector2(40, 25),
    new THREE.Vector3(0, -5, -25),
    new THREE.Vector3(0, 0, 0),
    0x100b13,
    false
  );
  scene.add(background.planeMesh);

  let higherGround = new Cube(
    "PortfolioGround",
    new THREE.Vector3(30, 3, 15),
    new THREE.Vector3(23, -5.5, 0),
    environmentColor,
    true
  );
  scene.add(higherGround.mesh);
  physicsWorld.addBody(higherGround.body);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let cameraOffset = new THREE.Vector3(1.5, 1.5, 0);
function cameraFollowPlayer() {
  camera.position.x = playerInstance.playerBody.position.x + cameraOffset.x;
  camera.position.y = playerInstance.playerBody.position.y + cameraOffset.y;
}

function initialize() {
  createRenderingComponents();

  createPlayer();
  createGeneralGeometry();
  
  const home = new Home(scene, physicsWorld, fontLoader);
  const portfolio = new Portfolio(scene, physicsWorld, textureLoader, fontLoader);
  const aboutMe = new AboutMe(scene, physicsWorld, textureLoader, fontLoader);
}

const frameClock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  physicsWorld.step(delta);

  playerInstance.update(delta);
  moveableObjects.forEach((element) => {
    element.update();
  });

  cameraFollowPlayer();

  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();
