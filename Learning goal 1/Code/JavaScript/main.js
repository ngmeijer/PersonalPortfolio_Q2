import { OrbitControls } from 'https://cdn.skypack.dev/three@0.104.0/examples/jsm/controls/OrbitControls.js';
import Player from "./Player.js";

const MainScene = new THREE.Scene();

let camera, renderer, light, playerGFX;
let player;
let clock = new THREE.Clock();
let delta = 0;

function initialize() {
  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  prepareLevel();
  preparePlayer();

  light = new THREE.PointLight(0xffffff, 4, 100);
  light.position.set(0, 2, 1);
  MainScene.add(light);

  camera.position.z = 17;
}

function animate() {
  requestAnimationFrame(animate);

  delta = clock.getDelta();
  update(delta);

  renderer.render(MainScene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function prepareLevel() {
  const groundGeo = new THREE.BoxGeometry(20, 0.5, 4);
  const groundMat = new THREE.MeshStandardMaterial();
  const ground = new THREE.Mesh(groundGeo, groundMat);
  MainScene.add(ground);
  ground.position.y = -3.5;
}

function preparePlayer() {
  player = new Player(1);
  MainScene.add(player);
  var playerPos = new THREE.Vector3(0,-1,0);
  player.position.set(0,-2,0);
  console.log(player.position);
  document.addEventListener("keydown", function(event){
    if(event.key === "KeyA") player.moveSpeed = -0.01;
    if(event.key === "KeyD") player.moveSpeed = 0.01;
  });
}

function cameraFollowPlayer() {
  camera.position.x = playerGFX.position.x;
}

function update(delta) {
  player.update(delta);
}

window.addEventListener("resize", onWindowResize, false);

initialize();
animate();
