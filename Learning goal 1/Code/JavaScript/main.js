import Cube from "./Cube.js";
import Plane from "./Plane.js";
import Player from "./Player.js";

const scene = new THREE.Scene();
const physicsWorld = new CANNON.World();
const fontLoader = new THREE.FontLoader();
const textureLoader = new THREE.TextureLoader();
fontLoader.load(
	"../Fonts/Josefin_Sans_Regular.json",

  function ( font ) {
		createTHREEText(font);
	},
);

physicsWorld.gravity.set(0, -12, 0);
let moveableObjects = [];

let playerInstance;
let moveDirection = 0;
let camera, renderer;

let movementClock = new THREE.Clock();
let physicsMat = new CANNON.Material("physicsMaterial");

function createRenderingComponents() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, -2, 8);

  renderer = new THREE.WebGLRenderer({ powerPreference: "high-performance", logarithmicDepthBuffer:true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  document.body.appendChild(renderer.domElement);
}

function createTHREEText(pFont){
  createHomeIntroText(pFont);
  createPortfolioText(pFont);
}

function createTHREEImages(){
  const geo = new THREE.PlaneBufferGeometry(3.15, 1.77
    );
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(`../Images/TDWE.png`)
  });

  const image = new THREE.Mesh(geo, material);

  scene.add(image);
  image.position.x = 11;
  image.position.y = -1.01;
}

createTHREEImages();

function createHomeIntroText(pFont){
  const geometry = new THREE.TextGeometry('Press A/D to move horizontally!\nPress space to jump', {font: pFont, size: 0.4, height: 0.01, });
  const textMesh = new THREE.Mesh(geometry,
    [new THREE.MeshPhongMaterial({color: 0xad4000}),
    new THREE.MeshPhongMaterial({color: 0x5c2301})
  ]);

  //textMesh.castShadow = true;
  textMesh.position.x = -3.5;
  textMesh.position.y = -4;
  textMesh.position.z = -2;
  scene.add(textMesh);
}

function createPortfolioText(pFont){
  const geometry = new THREE.TextGeometry('Try colliding with my \nportfolio items...!', {font: pFont, size: 0.4, height: 0.01, });
  const textMesh = new THREE.Mesh(geometry,
    [new THREE.MeshPhongMaterial({color: 0xad4000}),
    new THREE.MeshPhongMaterial({color: 0x5c2301})
  ]);

  //textMesh.castShadow = true;
  textMesh.position.x = 8.5;
  textMesh.position.y = -2.8;
  textMesh.position.z = -2;
  scene.add(textMesh);
}

function createGround() {
  let ground = new Plane(
    new THREE.Vector2(40, 10),
    new THREE.Vector3(0, -7, 0),
    new THREE.Vector3(-90,0,0),
    0x212121,
    true
  );
  scene.add(ground.planeMesh);
  physicsWorld.add(ground.planeBody);

  let background = new Plane(
    new THREE.Vector2(40, 25),
    new THREE.Vector3(0, -5, -5),
    new THREE.Vector3(0,0,0),
    0x212121,
    false
  );
  scene.add(background.planeMesh);
}

function createPlayer() {
  playerInstance = new Player(4, 7, new THREE.Vector3(2,0,0));
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

function createHomeArea() {
  let stairStep1 = new Cube(
    "StairStep1",
    new THREE.Vector3(2, 1, 3),
    new THREE.Vector3(5, -6.5, 0),
    0x202020,
    true,
    0
  );
  scene.add(stairStep1.cubeMesh);
  physicsWorld.addBody(stairStep1.cubeBody);

  let stairStep2 = new Cube(
    "StairStep2",
    new THREE.Vector3(2, 2, 3),
    new THREE.Vector3(7, -6, 0),
    0x202020,
    true,
    0
  );
  scene.add(stairStep2.cubeMesh);
  physicsWorld.addBody(stairStep2.cubeBody);
}

function createPortfolioArea() {
  let portfolioGround = new Cube(
    "PortfolioGround",
    new THREE.Vector3(14, 3, 3),
    new THREE.Vector3(15, -5.5, 0),
    0x202020,
    true,
  );
  scene.add(portfolioGround.cubeMesh);
  physicsWorld.addBody(portfolioGround.cubeBody);
  //physicsWorld.addContactMaterial(portfolioGround.contactMat);

  let platform1 = new Cube(
    "PortfolioPlatform1",
    new THREE.Vector3(3, 0.2, 0.7),
    new THREE.Vector3(15.5, -2.5, 0.1),
    0xCA6800,
    true,
    0
  );
  scene.add(platform1.cubeMesh);
  physicsWorld.addBody(platform1.cubeBody);

  let platform2 = new Cube(
    "PortfolioPlatform2",
    new THREE.Vector3(3, 0.2, 1.3),
    new THREE.Vector3(11, -2, 0.1),
    0xCA6800,
    true,
    0,
  );
  scene.add(platform2.cubeMesh);
  physicsWorld.addBody(platform2.cubeBody);

  let platform3 = new Cube(
    "PortfolioPlatform3",
    new THREE.Vector3(3, 0.2, 2),
    new THREE.Vector3(14.5, -0.1, 0.1),
    0xCA6800,
    true,
    0
  );
  scene.add(platform3.cubeMesh);
  physicsWorld.addBody(platform3.cubeBody);
}

function createAboutMeArea(){
  let door = new Cube(
    "BlueDoor",
    new THREE.Vector3(1, 5, 3),
    new THREE.Vector3(20, -1.5, 0),
    0x000E5B,
    true,
    0
  );
  scene.add(door.cubeMesh);
  physicsWorld.addBody(door.cubeBody);

  let blueCube = new Cube(
    "BlueCube",
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(0, -0, 0),
    0x000E5B,
    false,
    0.1,
    physicsMat,
    0,
    1
  );
  scene.add(blueCube.cubeMesh);
  physicsWorld.addBody(blueCube.cubeBody);
  physicsWorld.addContactMaterial(blueCube.contactMat);
  moveableObjects.push(blueCube);
}

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let cameraOffset = new THREE.Vector3(1.5, 1.5, 0);
function cameraFollowPlayer() {
  camera.position.x = playerInstance.playerBody.position.x + cameraOffset.x;
  camera.position.y = playerInstance.playerBody.position.y + cameraOffset.y;
}

function initialize() {
  createRenderingComponents();
  createGround();
  
  createPlayer();
  createHomeArea();
  createPortfolioArea();
  createAboutMeArea();
}

const frameClock = new THREE.Clock();
let delta;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  physicsWorld.step(delta);

  playerInstance.update(delta);
  moveableObjects.forEach(element => {
    element.update();
  });
  
  cameraFollowPlayer();

  render();
}

function render() {
  renderer.render(scene, camera);
}
initialize();
animate();
