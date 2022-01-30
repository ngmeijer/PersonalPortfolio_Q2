import Cube from "./Cube.js";
import Plane from "./Plane.js";
import Player from "./Player.js";

import Home from "./AreaClasses/Home.js";
import Portfolio from "./AreaClasses/Portfolio.js";
import AboutMe from "./AreaClasses/AboutMe.js";
import ContactMe from "./AreaClasses/ContactMe.js";
/////////////////


const mainScene = new THREE.Scene();
const physicsWorld = new CANNON.World();
const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();

let playerInstance;
let camera, renderer;

const home = new Home(mainScene, physicsWorld, fontLoader);
const portfolio = new Portfolio(mainScene, physicsWorld, textureLoader, fontLoader);
const item1Scene = new THREE.Scene();
const aboutMe = new AboutMe(mainScene, physicsWorld, textureLoader, fontLoader);
const contactMe = new ContactMe(mainScene, physicsWorld, textureLoader, fontLoader);

let fadeImage = document.getElementById("fadeImage");
let websiteComponents = [];
websiteComponents.push(home);
websiteComponents.push(portfolio);
websiteComponents.push(aboutMe);
websiteComponents.push(contactMe);

physicsWorld.gravity.set(0, -12, 0);
let activeScene = mainScene;

let environmentColor = 0x100b13, instructionTextColor = 0x9d0208, platformColor = 0xe85d04;
let playerPosition = new THREE.Vector3(0, 3, 1);

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
  mainScene.add(playerInstance.group);

  createMovementInput();
}
function createMovementInput() {
  document.addEventListener("keydown", function (event) {
    if (event.key == "a" || event.key == "A") {
      playerInstance.movingLeft = true;
    }
    if (event.key == "d" || event.key == "D") {
      playerInstance.movingRight = true;
    }
    if (event.key == " ") {
      playerInstance.handleJump();
    }
    if (event.key == "f" || event.key == "F") {
      playerInstance.moveIntoPortfolioItem();
      dimLighting();
    }
  });
  document.addEventListener("keyup", function (event) {
    if (event.key == "a" || event.key == "A") {
      playerInstance.movingLeft = false;
      playerInstance.hasPlayedLeftAnimation = false;
    }
    if (event.key == "d" || event.key == "D") {
      playerInstance.movingRight = false;
      playerInstance.hasPlayedRightAnimation = false;
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
  mainScene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);

  let background = new Plane(
    new THREE.Vector2(120, 25),
    new THREE.Vector3(0, 0, -25),
    new THREE.Vector3(0, 0, 0),
    0x100b13,
    false
  );
  mainScene.add(background.planeMesh);

  let higherGround = new Cube(
    "PortfolioGround",
    new THREE.Vector3(120, 3, 15),
    new THREE.Vector3(68, 1, 0),
    environmentColor,
    true
  );
  higherGround.addToScene(mainScene, physicsWorld);
}

function dimLighting() {
  var opacityTemp = { opacity: 0 };
  var opacityTarget = { opacity: 1 };
  var tween = new TWEEN.Tween(opacityTemp).to(opacityTarget, 2000).onUpdate(function () {
    fadeImage.style.setProperty("opacity", opacityTemp.opacity)
  }).onComplete(function () { activeScene = item1Scene });
  tween.start();
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

    websiteComponents[i].initializeArea();
  }
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
  renderer.render(activeScene, camera);
}
initialize();
animate();
