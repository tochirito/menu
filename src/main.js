import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

import * as THREE from "three";

const scene = new THREE.Scene();
const spaceBackground = new THREE.TextureLoader().load(
  "/images/black-backdrop.webp"
);
scene.background = spaceBackground;

//Camara
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 140;
camera.lookAt(0, 0, 0);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//luces
const ambientLight = new THREE.AmbientLight(0xdfe9f3, 0.5);

//niebla:
scene.fog = new THREE.Fog(0x2e3132, 40, 110);

//GRID
const gridHelper = new THREE.GridHelper(window.innerWidth, 120);

//Controles
// const controls = new OrbitControls(camera, renderer.domElement);

let glassIsocahedrum = null;
let glassIsocahedrum1 = null;
let glassCube = null;

function createCubesArray() {
  // Geometría de un cubo básico
  const sideSize = 14;
  const columns = 25;
  const rows = 15;

  const separation = 2;

  const gridInitialPosX = -180; // Posición inicial de la grid en x
  const gridInitialPosZ = -100; // Posición inicial de la grid en z
  const gridInitialPosY = -7; // Posición inicial de la grid en y

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      //Buttons

      let randomHelp = THREE.MathUtils.randInt(0, 100);
      //Background cubes
      if (randomHelp < 45) {
      } else {
        const cubeGeometry = new THREE.BoxGeometry(
          sideSize,
          THREE.MathUtils.randInt(0, 70),
          sideSize
        );
        const basicCubeMaterial = new THREE.MeshBasicMaterial({
          color: 0x949596,
        });
        const basicCube = new THREE.Mesh(cubeGeometry, basicCubeMaterial);

        // Ajustar las posiciones iniciales
        basicCube.position.x = gridInitialPosX + j * (sideSize + separation);
        basicCube.position.z = gridInitialPosZ + i * (sideSize + separation);
        basicCube.position.y = gridInitialPosY;

        scene.add(basicCube);
      }
    }
  }
}

let progress = 0;
//ANADIR A ESCENA
scene.add(ambientLight);
createCubesArray();
function animate() {
  // controls.update();

  if (progress < 1000) {
    progress++;
  } else {
    progress += 0.7;
  }

  // const time = progress * 0.0001;
  // camera.rotation.z = Math.sqrt(time % 10);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
