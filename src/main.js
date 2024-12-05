import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

import * as THREE from "three";

const scene = new THREE.Scene();
const spaceBackground = new THREE.TextureLoader().load("/images/b-w-fog.jpg");
scene.background = spaceBackground;

//Camara
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 70;
camera.lookAt(0, 0, 0);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//luces
const ambientLight = new THREE.AmbientLight(0xffffff, 2);

//niebla:
scene.fog = new THREE.Fog(0xdfe9f3, 60, 100);

//GRID
const gridHelper = new THREE.GridHelper(window.innerWidth, 120);

//Controles
const controls = new OrbitControls(camera, renderer.domElement);

function createCubesArray() {
  // Geometría de un cubo básico
  const sideSize = 14;
  const cubeGeometry = new THREE.BoxGeometry(sideSize, sideSize, sideSize);
  const basicCubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff5733 });

  const columns = 16;
  const rows = 8;

  const separation = 2;

  const gridInitialPosX = -118; // Posición inicial de la grid en x
  const gridInitialPosZ = -55; // Posición inicial de la grid en z
  const gridInitialPosY = -7; // Posición inicial de la grid en y

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const basicCube = new THREE.Mesh(cubeGeometry, basicCubeMaterial);

      // Ajustar las posiciones iniciales
      basicCube.position.x = gridInitialPosX + j * (sideSize + separation);
      basicCube.position.z = gridInitialPosZ + i * (sideSize + separation);
      basicCube.position.y = gridInitialPosY;

      scene.add(basicCube);
    }
  }
}

//ANADIR A ESCENA
scene.add(ambientLight, gridHelper);
createCubesArray();
function animate() {
  controls.update();

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
