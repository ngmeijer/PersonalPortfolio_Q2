import Home from "../Home.js";
import Portfolio from "../Portfolio.js";
import AboutMe from "../AboutMe.js";
import ContactMe from "../ContactMe.js";

import Plane from "../../Plane.js";
import Cube from "../../Cube.js";

import Player from "../../Player.js";

export default class MainScene extends THREE.Scene {
  light;

  homeArea;
  portfolioArea;
  aboutMeArea;
  contactMeArea;
  websiteComponents = [];
  mainPhysicsWorld;

  fontLoader;
  textureLoader;

  playerInstance;
  playerPosition = new THREE.Vector3(0, 3, 1);

  instructionTextColor;
  platformColor;
  environmentColor;

  constructor(pFontLoader, pTextureLoader) {
    super();
    this.fontLoader = pFontLoader;
    this.textureLoader = pTextureLoader;
  }

  initalizeScene() {
    this.mainPhysicsWorld = new CANNON.World();
    this.mainPhysicsWorld.gravity.set(0, -12, 0);
    this.createGeneralGeometry();

    this.homeArea = new Home(this, this.mainPhysicsWorld, this.fontLoader);
    this.portfolioArea = new Portfolio(
      this,
      this.mainPhysicsWorld,
      this.textureLoader,
      this.fontLoader
    );
    this.aboutMeArea = new AboutMe(
      this,
      this.mainPhysicsWorld,
      this.textureLoader,
      this.fontLoader
    );
    this.contactMeArea = new ContactMe(
      this,
      this.mainPhysicsWorld,
      this.textureLoader,
      this.fontLoader
    );

    this.websiteComponents.push(this.homeArea);
    this.websiteComponents.push(this.portfolioArea);
    this.websiteComponents.push(this.aboutMeArea);
    this.websiteComponents.push(this.contactMeArea);

    for (let i = 0; i < this.websiteComponents.length; i++) {
      this.websiteComponents[i].instructionTextColor =
        this.instructionTextColor;
      this.websiteComponents[i].platformColor = this.platformColor;
      this.websiteComponents[i].environmentColor = this.environmentColor;

      this.websiteComponents[i].playerInstance = this.playerInstance;

      this.websiteComponents[i].initializeArea();
    }

    this.createPlayer();
  }

  createPlayer() {
    this.playerInstance = new Player(4, 7, this.playerPosition);
    this.mainPhysicsWorld.addBody(this.playerInstance.playerBody);
    this.add(this.playerInstance.group);

    this.createMovementInput(this.playerInstance);
  }

  createMovementInput(pPlayer) {

    document.addEventListener("keydown", function (event) {
      if (event.key == "a" || event.key == "A") {
        pPlayer.movingLeft = true;
      }
      if (event.key == "d" || event.key == "D") {
        pPlayer.movingRight = true;
      }
      if (event.key == " ") {
        pPlayer.handleJump();
      }
      if (event.key == "f" || event.key == "F") {
        pPlayer.moveIntoPortfolioItem();
      }
    });
    document.addEventListener("keyup", function (event) {
      if (event.key == "a" || event.key == "A") {
        pPlayer.movingLeft = false;
        pPlayer.hasPlayedLeftAnimation = false;
      }
      if (event.key == "d" || event.key == "D") {
        pPlayer.movingRight = false;
        pPlayer.hasPlayedRightAnimation = false;
      }
    });
  }

  createGeneralGeometry() {
    let ground = new Plane(
      new THREE.Vector2(40, 50),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-90, 0, 0),
      this.environmentColor,
      true
    );
    this.add(ground.planeMesh);
    this.mainPhysicsWorld.addBody(ground.planeBody);

    let background = new Plane(
      new THREE.Vector2(120, 25),
      new THREE.Vector3(0, 0, -25),
      new THREE.Vector3(0, 0, 0),
      0x100b13,
      false
    );
    this.add(background.planeMesh);

    let higherGround = new Cube(
      "PortfolioGround",
      new THREE.Vector3(120, 3, 15),
      new THREE.Vector3(68, 1, 0),
      this.environmentColor,
      true
    );
    higherGround.addToScene(this, this.mainPhysicsWorld);
  }
}
