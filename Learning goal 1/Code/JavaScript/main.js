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

let environmentColor = 0x100b13;
let instructionTextColor = 0x9D0208;
let platformColor = 0xE85D04;

let websiteComponents = [];
let doors = [];
let doorMaxDistance = 3;

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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.antialias = true;
  document.body.appendChild(renderer.domElement);
}

function createPlayer() {
  playerInstance = new Player(4, 7, new THREE.Vector3(30, 10, 0));
  physicsWorld.addBody(playerInstance.playerBody);
  scene.add(playerInstance.playerMesh);

  createMovementInput();
}

function createMovementInput(){
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
    new THREE.Vector3(68, 1.5, 0),
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

function checkPlayerDistance(){
  for(let i = 0; i < doors.length; i++){
    let distance = playerInstance.playerPosition.distanceTo(doors[i].pos);
    
  }
}

function initialize() {
  createRenderingComponents();

  createPlayer();
  createGeneralGeometry();
  
  const home = new Home(scene, physicsWorld, fontLoader);
  const portfolio = new Portfolio(scene, physicsWorld, textureLoader, fontLoader);
  const aboutMe = new AboutMe(scene, physicsWorld, textureLoader, fontLoader);
  const contactMe = new ContactMe(scene, physicsWorld, textureLoader, fontLoader);

  websiteComponents.push(home);
  websiteComponents.push(portfolio);
  websiteComponents.push(aboutMe);
  websiteComponents.push(contactMe);

  for(let i = 0; i < websiteComponents.length; i++){
    websiteComponents[i].instructionTextColor = instructionTextColor;
    websiteComponents[i].platformColor = platformColor;
    websiteComponents[i].environmentColor = environmentColor;

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
  moveableObjects.forEach((element) => {
    element.update();
  });

  cameraFollowPlayer();
  checkPlayerDistance();

  TWEEN.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();
