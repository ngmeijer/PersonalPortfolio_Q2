import CanvasController from "./CanvasController.js";
import Cube from "./Cube.js";
import Plane from "./Plane.js";
import Player from "./Player.js";

const scene = new THREE.Scene();
const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -12, 0);

let playerInstance;
const canvasController = new CanvasController(document, window);
let moveDirection = 0;
let camera, renderer;

let movementClock = new THREE.Clock();

function createRenderingComponents() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, -2, 8);

  renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", logarithmicDepthBuffer:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);
}

function createGround() {
  let ground = new Plane(
    new THREE.Vector2(40, 10),
    new THREE.Vector3(0, -7, 0),
    new THREE.Vector3(-90,0,0),
    0x212121,
    true
  );
  scene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);

  let background = new Plane(
    new THREE.Vector2(40, 25),
    new THREE.Vector3(0, -5, -5),
    new THREE.Vector3(0,0,0),
    0x212121,
    false
  );
  scene.add(background.planeMesh);
}

function createPlayer() {
  playerInstance = new Player(4, 6);
  canvasController.foregroundSpeed = playerInstance.defaultMoveSpeed * 100;
  physicsWorld.addBody(playerInstance.playerBody);
  scene.add(playerInstance.playerMesh);
  scene.add(playerInstance.light);

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

function createHomeArea() {
  let stairStep1 = new Cube(
    new THREE.Vector3(2, 1, 3),
    new THREE.Vector3(5, -6.5, 0),
    0x202020,
    true,
    0
  );
  scene.add(stairStep1.cubeMesh);
  physicsWorld.addBody(stairStep1.cubeBody);

  let stairStep2 = new Cube(
    new THREE.Vector3(2, 2, 3),
    new THREE.Vector3(7, -6, 0),
    0x202020,
    true,
    0
  );
  scene.add(stairStep2.cubeMesh);
  physicsWorld.addBody(stairStep2.cubeBody);
}

function createPortfolioArea() {
  let ground = new Cube(
    new THREE.Vector3(14, 3, 3),
    new THREE.Vector3(15, -5.5, 0),
    0x202020,
    true,
    0
  );
  scene.add(ground.cubeMesh);
  physicsWorld.addBody(ground.cubeBody);

  let platform1 = new Cube(
    new THREE.Vector3(3, 0.2, 1),
    new THREE.Vector3(15.5, -2.8, 0.1),
    0xCA6800,
    true,
    0
  );
  scene.add(platform1.cubeMesh);
  physicsWorld.addBody(platform1.cubeBody);

  let platform2 = new Cube(
    new THREE.Vector3(3, 0.2, 1),
    new THREE.Vector3(11, -2.5, 0.1),
    0xCA6800,
    true,
    0
  );
  scene.add(platform2.cubeMesh);
  physicsWorld.addBody(platform2.cubeBody);
}

function createAboutMeArea(){
  let door = new Cube(
    new THREE.Vector3(1, 5, 3),
    new THREE.Vector3(20, -1.5, 0),
    0x000E5B,
    true,
    0
  );
  scene.add(door.cubeMesh);
  physicsWorld.addBody(door.cubeBody);

  let blueCube = new Cube(
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(18, -1.5, 0),
    0x000E5B,
    false,
    1
  );
  scene.add(blueCube.cubeMesh);
  physicsWorld.addBody(blueCube.cubeBody);
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
  createGround();
  
  createPlayer();
  createHomeArea();
  createPortfolioArea();
  createAboutMeArea();
}

const frameClock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  physicsWorld.step(delta);

  playerInstance.update(delta);
  canvasController.moveUIHorizontally(delta, moveDirection, playerInstance.canMove);
  canvasController.moveUIVertically(delta, playerInstance.isJumping, playerInstance.velocity.y);
  cameraFollowPlayer();

  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();
