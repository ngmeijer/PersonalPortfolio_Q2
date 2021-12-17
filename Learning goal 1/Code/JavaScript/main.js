import Player from "./Player.js";

let scene, camera, renderer, light, playerGFX;
let player;


function initialize() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75,
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
  light.position.set(
    0,2,1
  );
  scene.add(light);

  camera.position.z = 10;
}

function animate() {
  requestAnimationFrame(animate);

  update();

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function prepareLevel() {
  const groundGeo = new THREE.BoxGeometry(20, 0.5, 4);
  const groundMat = new THREE.MeshStandardMaterial ();
  const ground = new THREE.Mesh(groundGeo, groundMat);
  scene.add(ground);
  ground.position.y = -3.5;
}

function preparePlayer() {
  const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
  const playerMat = new THREE.MeshStandardMaterial();
  playerMat.color.setHex(0x2305FD);
  playerGFX = new THREE.Mesh(playerGeo, playerMat);
  playerGFX.position.setY(-3);
  player = new Player(playerGFX, 10);
  scene.add(player);
  scene.add(playerGFX);
  document.addEventListener("keydown", player.handleMovement, false);
}

function cameraFollowPlayer() {
  camera.position.x = playerGFX.position.x;
}

function update() {

}

window.addEventListener("resize", onWindowResize, false);

initialize();
animate();
