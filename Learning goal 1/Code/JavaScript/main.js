// import Player from "./Player.js";

import Player from "./Player.js";

// let physicsScene, mainScene, camera, renderer, light;
// let player;
// let clock = new THREE.Clock();
// let delta = 0;
// let timeStep;

// let playerBody;
// let obstacleMaterial;

// function prepareAll() {
//   prepareCannon();
//   prepareThree();
//   prepareGFX();
//   document.body.appendChild(renderer.domElement);
//   window.addEventListener("resize", onWindowResize, false);

//   initializeTestShape();
// }

// function prepareGFX() {
//   prepareLevel();
//   preparePlayer();
// }

// function prepareThree() {
//   mainScene = new THREE.Scene();

//   camera = new THREE.PerspectiveCamera(
//     30,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );

//   renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//   light = new THREE.DirectionalLight(0xffffff, 3.5);
//   light.position.set(-6, 1, 0);
//   light.castShadow = true;
//   light.shadowCameraVisible = true;

//   mainScene.add(light);

//   camera.position.z = 15;
//   camera.position.y = 5;
// }

// function prepareCannon() {
//   physicsScene = new CANNON.World();
//   physicsScene.gravity.set(0, -9.82, 0);
//   physicsScene.broadphase = new CANNON.NaiveBroadphase();

//   var mass = 5,
//     radius = 1;
//   var sphereShape = new CANNON.Sphere(radius);
//   var sphereRB = new CANNON.Body({ mass: mass, shape: sphereShape });
//   sphereRB.position.set(0, 0, 0);
//   physicsScene.addBody(sphereRB);

//   var groundShape = new CANNON.Plane();
//   var groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
//   physicsScene.addBody(groundBody);

//   timeStep = 1.0 / 60.0;
//   physicsScene.solver.iterations = 10;

//   var physicsMaterial = new CANNON.Material("groundMaterial");
//   var physicsContactMaterial = new CANNON.ContactMaterial(
//     physicsMaterial,
//     physicsMaterial
//   );

//   physicsScene.addContactMaterial(physicsContactMaterial);

//   var otherMaterial = new CANNON.Material("slipperyMaterial");

//   var anotherContactMaterial = new CANNON.ContactMaterial(
//     physicsMaterial,
//     otherMaterial,
//     0.0,
//     0.9
//   );

//   physicsScene.addContactMaterial(anotherContactMaterial);

//   var halfExtends = new CANNON.Vec3(0.25, 0.5, 0.25);
//   var boxShape = new CANNON.Box(halfExtends);

//   var boxGeometry = new THREE.BoxGeometry(
//     halfExtends.x * 2,
//     halfExtends.y * 2,
//     halfExtends.z * 2
//   );

//   playerBody = new CANNON.Body(5, boxShape);
//   playerBody.addShape(boxShape);
//   playerBody.material = anotherContactMaterial;
//   physicsScene.addBody(playerBody);
// }

// function initializeTestShape() {
//   const normalMaterial = new THREE.MeshNormalMaterial();
//   const phongMaterial = new THREE.MeshPhongMaterial();
//   obstacleMaterial = new THREE.MeshStandardMaterial();
//   obstacleMaterial.color.setHex(0x2305fd);

//   const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//   const cubeMesh = new THREE.Mesh(cubeGeometry, obstacleMaterial);
//   cubeMesh.position.x = -3;
//   cubeMesh.position.y = 0;
//   cubeMesh.castShadow = true;

//   mainScene.add(cubeMesh);

//   const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
//   const cubeBody = new CANNON.Body({mass: 1});
//   cubeBody.addShape(cubeShape);
//   cubeBody.position.x = cubeMesh.position.x;
//   cubeBody.position.y = cubeMesh.position.y;
//   cubeBody.position.z = cubeMesh.position.z;
//   physicsScene.addBody(cubeBody);

//   console.log(cubeBody);
// }

// function animate() {
//   delta = Math.min(clock.getDelta(), 0.1)
//   physicsScene.step(delta);
//   requestAnimationFrame(animate);

//   update(delta);

//   renderer.render(mainScene, camera);
// }

// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function prepareLevel() {
//   const groundGeo = new THREE.BoxGeometry(100, 0.5, 4);
//   const groundMat = new THREE.MeshStandardMaterial();
//   const ground = new THREE.Mesh(groundGeo, groundMat);
//   ground.receiveShadow = true;
//   mainScene.add(ground);
//   ground.position.y = -3.5;
// }

// function preparePlayer() {
//   player = new Player(4);
//   mainScene.add(player);
//   document.addEventListener("keydown", function (event) {
//     if (event.key == "a" || event.key == "A") player.movingLeft = true;
//     if (event.key == "d" || event.key == "D") player.movingRight = true;
//   });
//   document.addEventListener("keyup", function (event) {
//     if (event.key == "a" || event.key == "A") player.movingLeft = false;
//     if (event.key == "d" || event.key == "D") player.movingRight = false;
//   });

//   document.addEventListener("keydown", function (event) {
//     if (event.key == "space") player.movingLeft = true;
//   });
// }

// function update(delta) {
//   //followPlayer();
//   playerBody.position = player.position;
//   player.update(delta);
//   camera.lookAt(player.position);
// }

// function followPlayer() {
//   camera.position.x = player.position.x;
// }

// window.onload = function () {
//   prepareAll();
//   animate();
// };

// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Stats from 'three/examples/jsm/libs/stats.module'
// import { GUI } from 'dat.gui'
// import * as CANNON from 'cannon-es'

const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

let obstacleMaterial, playerMaterial, groundMaterial;
let playerInstance;

const light1 = new THREE.SpotLight();
light1.position.set(2.5, 5, 5);
light1.angle = Math.PI / 4;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 20;
scene.add(light1);

const light2 = new THREE.SpotLight();
light2.position.set(-2.5, 5, 5);
light2.angle = Math.PI / 4;
light2.castShadow = true;
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 20;
scene.add(light2);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 4, 10);
camera.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const physicsWorld = new CANNON.World();
physicsWorld.gravity.set(0, -9.82, 0);

const normalMaterial = new THREE.MeshNormalMaterial();
obstacleMaterial = new THREE.MeshPhongMaterial();
obstacleMaterial.color.setHex(0x2305fd);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMesh = new THREE.Mesh(cubeGeometry, obstacleMaterial);
cubeMesh.position.x = -3;
cubeMesh.position.y = 3;
cubeMesh.castShadow = true;
scene.add(cubeMesh);
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const cubeBody = new CANNON.Body({ mass: 1 });
cubeBody.addShape(cubeShape);
cubeBody.position.x = cubeMesh.position.x;
cubeBody.position.y = cubeMesh.position.y;
cubeBody.position.z = cubeMesh.position.z;
physicsWorld.addBody(cubeBody);

const sphereGeometry = new THREE.SphereGeometry();
const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial);
sphereMesh.position.x = -1;
sphereMesh.position.y = 6;
sphereMesh.castShadow = true;
scene.add(sphereMesh);
const sphereShape = new CANNON.Sphere(1);
const sphereBody = new CANNON.Body({ mass: 1 });
sphereBody.addShape(sphereShape);
sphereBody.position.x = sphereMesh.position.x;
sphereBody.position.y = sphereMesh.position.y;
sphereBody.position.z = sphereMesh.position.z;
physicsWorld.addBody(sphereBody);

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

function createPlayer() {
  playerInstance = new Player(2);
  physicsWorld.addBody(playerInstance.playerBody);
  scene.add(playerInstance.playerMesh);

  document.addEventListener("keydown", function (event) {
    if (event.key == "a" || event.key == "A") playerInstance.movingLeft = true;
    if (event.key == "d" || event.key == "D") playerInstance.movingRight = true;
  });
  document.addEventListener("keyup", function (event) {
    if (event.key == "a" || event.key == "A") playerInstance.movingLeft = false;
    if (event.key == "d" || event.key == "D") playerInstance.movingRight = false;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key == "space") playerInstance.movingLeft = true;
  });
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
  sphereMesh.position.set(
    sphereBody.position.x,
    sphereBody.position.y,
    sphereBody.position.z
  );
  sphereMesh.quaternion.set(
    sphereBody.quaternion.x,
    sphereBody.quaternion.y,
    sphereBody.quaternion.z,
    sphereBody.quaternion.w
  );

  playerInstance.update(delta);

  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
