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
  //camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.5);

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
    new THREE.Vector3(0, 0, 0),
    0x003b0c
  );
  scene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);
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

function createLighting() {
  const light1 = new THREE.PointLight();
  light1.position.set(0, 3, 0);
  light1.angle = Math.PI / 4;
  light1.intensity = 1;
  light1.castShadow = true;
  //scene.add(light1);
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

  let stairStep3 = new Cube(
    new THREE.Vector3(2, 3, 3),
    new THREE.Vector3(9, -5.5, 0),
    0x202020,
    true,
    0
  );
  scene.add(stairStep3.cubeMesh);
  physicsWorld.addBody(stairStep3.cubeBody);
}

function createPortfolioArea() {
  let ground = new Cube(
    new THREE.Vector3(10, 3, 3),
    new THREE.Vector3(13, -5.5, 0),
    0x202020,
    true,
    0
  );
  scene.add(ground.cubeMesh);
  physicsWorld.addBody(ground.cubeBody);

  let platform1 = new Cube(
    new THREE.Vector3(3, 0.2, 1),
    new THREE.Vector3(15, -2.8, 0),
    0x202020,
    true,
    0
  );
  scene.add(platform1.cubeMesh);
  physicsWorld.addBody(platform1.cubeBody);

  let platform2 = new Cube(
    new THREE.Vector3(3, 0.2, 1),
    new THREE.Vector3(11, -2.5, 0),
    0x202020,
    true,
    0
  );
  scene.add(platform2.cubeMesh);
  physicsWorld.addBody(platform2.cubeBody);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}


let cameraOffsetX = 1.5;
function cameraFollowPlayer() {
  camera.lookAt(new THREE.Vector3(playerInstance.playerPosition.x, -4.5, 0));
  camera.position.x = playerInstance.playerBody.position.x - cameraOffsetX;
  camera.position.y = playerInstance.playerBody.position.y + 3;
}

function initialize() {
  createRenderingComponents();
  createGround();
  createLighting();
  
  createPlayer();
  createHomeArea();
  createPortfolioArea();
}

const frameClock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  physicsWorld.step(delta);

  playerInstance.update(delta);
  canvasController.moveUI(delta, moveDirection, playerInstance.canMove);
  cameraFollowPlayer();

  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();
