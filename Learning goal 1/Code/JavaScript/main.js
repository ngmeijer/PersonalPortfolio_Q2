import Cube from "./Cube.js";
import Plane from "./Plane.js";
import Player from "./Player.js";

import Home from "./AreaClasses/Home.js";
import Portfolio from "./AreaClasses/Portfolio.js";
import AboutMe from "./AreaClasses/AboutMe.js";
import ContactMe from "./AreaClasses/ContactMe.js";
/////////////////


const scene = new THREE.Scene();
const physicsWorld = new CANNON.World();
const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();

let playerInstance;
let camera, renderer;

const home = new Home(scene, physicsWorld, fontLoader);
const portfolio = new Portfolio(scene, physicsWorld, textureLoader, fontLoader);
const aboutMe = new AboutMe(scene, physicsWorld, textureLoader, fontLoader);
const contactMe = new ContactMe(scene, physicsWorld, textureLoader, fontLoader);

let websiteComponents = [];
websiteComponents.push(home);
websiteComponents.push(portfolio);
websiteComponents.push(aboutMe);
websiteComponents.push(contactMe);

physicsWorld.gravity.set(0, -12, 0);

let environmentColor = 0x100b13, instructionTextColor = 0x9d0208, platformColor = 0xe85d04;
let moveDirection = 0;
let doors = [];
let playerPosition = new THREE.Vector3(30,10,0);

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

function createPlayer() {
  playerInstance = new Player(4, 7, playerPosition);
  physicsWorld.addBody(playerInstance.playerBody);
  scene.add(playerInstance.playerMesh);

  createMovementInput();
}

function createMovementInput() {
  document.addEventListener("keydown", function (event) {
    if (event.key == "a" || event.key == "A") {
      playerInstance.movingLeft = true;
      moveDirection = -1;
    }
    if (event.key == "d" || event.key == "D") {
      playerInstance.movingRight = true;
      moveDirection = 1;
    }
    if (event.key == " ") {
      playerInstance.handleJump();
    }
    if(event.key == "f" || event.key == "F"){
      playerInstance.moveIntoPortfolioItem();
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
}

function createGeneralGeometry() {
  let ground = new Plane(
    new THREE.Vector2(40, 50),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-90, 0, 0),
    environmentColor,
    true
  );
  scene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);

  let background = new Plane(
    new THREE.Vector2(120, 25),
    new THREE.Vector3(0, 0, -25),
    new THREE.Vector3(0, 0, 0),
    0x100b13,
    false
  );
  scene.add(background.planeMesh);

  let higherGround = new Cube(
    "PortfolioGround",
    new THREE.Vector3(120, 3, 15),
    new THREE.Vector3(68, 1, 0),
    environmentColor,
    true
  );
  higherGround.addToScene(scene, physicsWorld);
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
  camera.position.x = playerInstance.playerBody.position.x + cameraOffset.x;
  camera.position.y = playerInstance.playerBody.position.y + cameraOffset.y;
}

function initialize() {
  createRenderingComponents();

  createPlayer();
  createGeneralGeometry();

  for (let i = 0; i < websiteComponents.length; i++) {
    websiteComponents[i].instructionTextColor = instructionTextColor;
    websiteComponents[i].platformColor = platformColor;
    websiteComponents[i].environmentColor = environmentColor;

    websiteComponents[i].playerInstance = playerInstance;

    websiteComponents[i].initialize();
  }

  doors.push(aboutMe.door);
}

const frameClock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  physicsWorld.step(delta);

  playerInstance.update(delta);
  for (let i = 0; i < websiteComponents.length; i++) {
    websiteComponents[i].update();
  }

  cameraFollowPlayer();

  TWEEN.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();
