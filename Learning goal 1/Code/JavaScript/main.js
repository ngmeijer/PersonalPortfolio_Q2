
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
  update();

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
  player = new Player(10);
  MainScene.add(player);
  document.addEventListener("keydown", function(event){
    player.handleMovement(event, delta);
  });
}

function cameraFollowPlayer() {
  camera.position.x = playerGFX.position.x;
}

function update() {
  player.handleMovement();
}

window.addEventListener("resize", onWindowResize, false);

initialize();
animate();
