import CanvasController from "./CanvasController.js";
import Cube from "./Cube.js";
import Plane from "./Plane.js";
import Player from "./Player.js";

const scene = new THREE.Scene();
const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0);

let playerInstance;
const canvasController = new CanvasController(document, window);
let moveDirection = 0;
let camera, renderer;

function createRenderingComponents(){
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, -1, 8);
  camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.5);
  
  renderer = new THREE.WebGLRenderer({powerPreference: "high-performance"});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);
}

function createGround() {
  let ground = new Plane(new THREE.Vector2(40, 10), new THREE.Vector3(0,0,0), 0x003b0c);
  scene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);
}

function createPlayer() {
  playerInstance = new Player(2, 6);
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

function createLighting(){
  const light1 = new THREE.PointLight();
  light1.position.set(0, 3, 0);
  light1.angle = Math.PI / 4;
  light1.intensity = 1;
  light1.castShadow = true;
  //scene.add(light1);
}

function createObstacles() {
  let cube1 = new Cube(new THREE.Vector3(2,1,3), new THREE.Vector3(5, -6.5, 0), 0x9D009B, true, 0);
  scene.add(cube1.cubeMesh);
  physicsWorld.addBody(cube1.cubeBody);

  let cube2 = new Cube(new THREE.Vector3(3,2,3), new THREE.Vector3(7, -6.5, 0), 0x9D009B, true, 0);
  scene.add(cube2.cubeMesh);
  physicsWorld.addBody(cube2.cubeBody);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const clock = new THREE.Clock();
let delta;

let cameraOffsetX = 3.5;
function cameraFollowPlayer() {
  camera.position.x = playerInstance.playerBody.position.x + cameraOffsetX;
}

function initialize() {
  createRenderingComponents();
  createPlayer();
  createObstacles();
  createGround();
  createLighting();
}

function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(clock.getDelta(), 0.1);
  physicsWorld.step(delta);

  playerInstance.update(delta);
  canvasController.moveUI(delta, moveDirection);
  cameraFollowPlayer();

  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();



