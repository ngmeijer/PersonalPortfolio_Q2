//import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

  document.body.appendChild(renderer.domElement);

  prepareLevel();
  preparePlayer();

  light = new THREE.PointLight(0xffffff, 3, 10);
  light.position.set(-6, 1, 0);
  light.castShadow = true;
  light.shadowCameraVisible = true;

  MainScene.add(light);

  camera.position.z = 15;
  camera.position.y = 5;
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
  const groundGeo = new THREE.BoxGeometry(100, .5, 4);
  const groundMat = new THREE.MeshStandardMaterial();
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  MainScene.add(ground);
  ground.position.y = -3.5;
}

function preparePlayer() {
  player = new Player(4);
  MainScene.add(player);
  document.addEventListener("keydown", function(event){
    if(event.key == "a" || event.key == "A") player.movingLeft = true;
    if(event.key == "d" || event.key == "D") player.movingRight = true;
  });
  document.addEventListener("keyup", function(event){
    if(event.key == "a" || event.key == "A") player.movingLeft = false;
    if(event.key == "d" || event.key == "D") player.movingRight = false;
  });

  document.addEventListener("keydown", function(event){
    if(event.key == "space") player.movingLeft = true;
  });
}

function update(delta) {
  followPlayer();
  player.update(delta);
  camera.lookAt(player.position);
}

function followPlayer(){
  camera.position.x = player.position.x;
}

window.addEventListener("resize", onWindowResize, false);

initialize();
animate();
