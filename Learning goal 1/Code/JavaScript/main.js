import Player from "./Player.js";

let World, MainScene, camera, renderer, light;
let player;
let clock = new THREE.Clock();
let delta = 0;
let timeStep;

let playerBody;

function prepareAll() {
  prepareCannon();
  prepareThree();
  prepareGFX();
  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}

function prepareGFX() {
  prepareLevel();
  preparePlayer();
}

function prepareThree() {
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

  light = new THREE.DirectionalLight( 0xffffff, 3.5 );
  light.position.set(-6, 1, 0);
  light.castShadow = true;
  light.shadowCameraVisible = true;

  MainScene.add(light);

  camera.position.z = 15;
  camera.position.y = 5;
}

function prepareCannon() {
  World = new CANNON.World();
  World.gravity.set(0, -9.82, 0);
  World.broadphase = new CANNON.NaiveBroadphase();

  var mass = 5,
    radius = 1;
  var sphereShape = new CANNON.Sphere(radius);
  var sphereRB = new CANNON.Body({ mass: mass, shape: sphereShape });
  sphereRB.position.set(0, 0, 0);
  World.addBody(sphereRB);

  var groundShape = new CANNON.Plane();
  var groundBody = new CANNON.Body({ mass: 0, shape: groundShape });
  World.addBody(groundBody);

  timeStep = 1.0 / 60.0;
  World.solver.iterations = 2;

  var physicsMaterial = new CANNON.Material("groundMaterial");
  var physicsContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    physicsMaterial
  );

  World.addContactMaterial(physicsContactMaterial);

  var otherMaterial = new CANNON.Material("slipperyMaterial");

  var anotherContactMaterial = new CANNON.ContactMaterial(
    physicsMaterial,
    otherMaterial,
    0.0,
    0.9
  );

  World.addContactMaterial(anotherContactMaterial);

  var halfExtends = new CANNON.Vec3(0.25, 0.5, 0.25);
  var boxShape = new CANNON.Box(halfExtends);

  var boxGeometry = new THREE.BoxGeometry(
    halfExtends.x * 2,
    halfExtends.y * 2,
    halfExtends.z * 2
  );

  playerBody = new CANNON.Body(5, boxShape);
  playerBody.addShape(boxShape);
  playerBody.material = anotherContactMaterial;
  World.addBody(playerBody);
}

function animate() {
  World.step(1.0 / 60.0);
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
  const groundGeo = new THREE.BoxGeometry(100, 0.5, 4);
  const groundMat = new THREE.MeshStandardMaterial();
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  MainScene.add(ground);
  ground.position.y = -3.5;
}

function preparePlayer() {
  player = new Player(4);
  MainScene.add(player);
  document.addEventListener("keydown", function (event) {
    if (event.key == "a" || event.key == "A") player.movingLeft = true;
    if (event.key == "d" || event.key == "D") player.movingRight = true;
  });
  document.addEventListener("keyup", function (event) {
    if (event.key == "a" || event.key == "A") player.movingLeft = false;
    if (event.key == "d" || event.key == "D") player.movingRight = false;
  });

  document.addEventListener("keydown", function (event) {
    if (event.key == "space") player.movingLeft = true;
  });
}

function update(delta) {
  //followPlayer();
  console.log(playerBody.position, player.position);
  playerBody.position = player.position;
  player.update(delta);
  camera.lookAt(player.position);
}

function followPlayer() {
  camera.position.x = player.position.x;
}

window.onload = function () {
  prepareAll();
  animate();
};
