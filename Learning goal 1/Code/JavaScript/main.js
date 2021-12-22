import Player from "./Player.js";

let MainScene, camera, renderer, light, playerGFX;
let player;
let clock = new THREE.Clock();
let delta = 0;

function initialize() {
  initThree();
  initWorld();
  initVisuals();
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}

function initVisuals(){
  prepareLevel();
  preparePlayer();
}

function initThree(){
  MainScene = new THREE.Scene();

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

  light = new THREE.PointLight(0xffffff, 3, 10);
  light.position.set(-6, 1, 0);
  light.castShadow = true;
  light.shadowCameraVisible = true;

  MainScene.add(light);

  camera.position.z = 15;
  camera.position.y = 5;
}

function initWorld(){
  const world = new CANNON.World();
  world.gravity.set(0,-10,0);

  const groundShape = new CANNON.Plane();
  let groundMaterial = new CANNON.Material();
  const groundBody = new CANNON.Body({mass:0, material:groundMaterial});
  groundBody.addShape(groundShape);
  world.add(groundBody);
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

initialize();
animate();
