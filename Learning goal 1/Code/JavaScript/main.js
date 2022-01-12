import CanvasController from "./CanvasController.js";
import Player from "./Player.js";

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

let obstacleMaterial, playerMaterial, groundMaterial;
let playerInstance;
let cubeMesh, cubeBody;
const canvasController = new CanvasController(document, window);
let moveDirection = 0;

const light1 = new THREE.PointLight();
light1.position.set(0, 3, 0);
light1.angle = Math.PI / 4;
light1.intensity = 1;
light1.castShadow = true;
scene.add(light1);

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, -1, 8);
camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0);

const normalMaterial = new THREE.MeshNormalMaterial();
obstacleMaterial = new THREE.MeshPhongMaterial();
obstacleMaterial.color.setHex(0xb905fd);

groundMaterial = new THREE.MeshPhongMaterial();
groundMaterial.color.setHex(0x003b0c);

function createGround() {
  const planeGeometry = new THREE.PlaneGeometry(40, 10);
  const planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);
  planeMesh.rotateX(-Math.PI / 2);
  planeMesh.receiveShadow = true;
  planeMesh.position.y = -7;
  scene.add(planeMesh);
  const planeShape = new CANNON.Plane();
  const planeBody = new CANNON.Body({ mass: 0 });
  planeBody.position.y = planeMesh.position.y;
  planeBody.addShape(planeShape);
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  physicsWorld.addBody(planeBody);
}

function createPlayer() {
  playerInstance = new Player(2, 6);
  canvasController.foregroundSpeed = playerInstance.defaultMoveSpeed * 100;
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

function createObstacles() {
  const cubeGeo = new THREE.BoxGeometry(2, 1, 3);
  cubeMesh = new THREE.Mesh(cubeGeo, obstacleMaterial);
  cubeMesh.position.x = 5;
  cubeMesh.position.y = -6.5;
  cubeMesh.castShadow = true;
  cubeMesh.receiveShadow = true;
  scene.add(cubeMesh);
  const cubeShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 1.5));

  cubeBody = new CANNON.Body({ mass: 0 });
  cubeBody.addShape(cubeShape);
  cubeBody.position.x = cubeMesh.position.x;
  cubeBody.position.y = cubeMesh.position.y;
  cubeBody.position.z = cubeMesh.position.z;
  physicsWorld.addBody(cubeBody);
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

initialize();

function initialize() {
  createPlayer();
  createObstacles();
  createGround();
}

let cameraOffsetX = 3.5;
function cameraFollowPlayer() {
  //camera.lookAt(playerInstance.position);
  camera.position.x = playerInstance.playerBody.position.x + cameraOffsetX;
}

function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(clock.getDelta(), 0.1);
  physicsWorld.step(delta);

  // Copy coordinates from Cannon to Three.js
  cubeMesh.position.set(
    cubeBody.position.x,
    cubeBody.position.y,
    cubeBody.position.z
  );
  cubeMesh.quaternion.set(
    cubeBody.quaternion.x,
    cubeBody.quaternion.y,
    cubeBody.quaternion.z,
    cubeBody.quaternion.w
  );

  playerInstance.update(delta);
  canvasController.moveUI(delta, moveDirection);
  cameraFollowPlayer();

  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
