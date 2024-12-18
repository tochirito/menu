import { OrbitControls } from "three/examples/jsm/Addons.js";
import "./style.css";

import * as THREE from "three";
import { ThreeMFLoader } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const spaceBackground = new THREE.TextureLoader().load(
  "/images/black-backdrop.webp"
);
// const spaceBackground = new THREE.TextureLoader().load("/images/images.jpeg");

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
// const ambientLight = new THREE.AmbientLight(0xffffff, 10.0);
const ambientLight = new THREE.AmbientLight(0xdfe9f3, 0.5);

//niebla:
scene.fog = new THREE.Fog(0x2e3132, 40, 210);

//GRID
const gridHelper = new THREE.GridHelper(window.innerWidth, 120);

//Controles
const controls = new OrbitControls(camera, renderer.domElement);

const glassMeshes = []; // Array para almacenar las meshes

function generateGlassElements() {
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    transmission: 1.0,
    ior: 0.7,
    thickness: 0.5,
    specularIntensity: 1.0,
    clearCoat: 1.0,
    color: new THREE.Color(1, 1, 10),
  });

  const isocahedrumGeometry = new THREE.IcosahedronGeometry(15);
  const octahedrumGeometry = new THREE.OctahedronGeometry(15);
  const boxGeometry = new THREE.BoxGeometry(15, 15, 15);

  const glassIcosahedrum = new THREE.Mesh(isocahedrumGeometry, glassMaterial);
  const glassOctahedrum = new THREE.Mesh(octahedrumGeometry, glassMaterial);
  const glassBox = new THREE.Mesh(boxGeometry, glassMaterial);

  const meshes = [glassIcosahedrum, glassOctahedrum, glassBox];
  const positions = [];

  function isPositionValid(newPosition, minDistance) {
    for (const pos of positions) {
      const distance = pos.distanceTo(newPosition);
      if (distance < minDistance) {
        return false;
      }
    }
    return true;
  }

  function generateValidPosition(minDistance) {
    let validPosition;
    do {
      const x = THREE.MathUtils.randInt(-80, 80);
      const z = THREE.MathUtils.randInt(-80, 80);
      const y = THREE.MathUtils.randInt(30, 60);
      validPosition = new THREE.Vector3(x, y, z);
    } while (!isPositionValid(validPosition, minDistance));
    return validPosition;
  }

  const minDistance = 60; // Distancia mínima de separación

  for (const mesh of meshes) {
    const pos = generateValidPosition(minDistance);
    mesh.position.set(pos.x, pos.y, pos.z);
    positions.push(new THREE.Vector2(pos.x, pos.z)); // Almacenar solo X y Z para la validación de distancia
    scene.add(mesh);
  }

  // Animar la rotación de los objetos
  function animate() {
    requestAnimationFrame(animate);

    // Ajustar la velocidad de rotación
    const rotationSpeed = 0.01;
    meshes.forEach((mesh) => {
      mesh.rotation.x += rotationSpeed;
      mesh.rotation.y += rotationSpeed;
    });

    renderer.render(scene, camera);
  }

  // Iniciar la animación
  animate();
}

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
let speed = 1; // Velocidad inicial alta
const slowdownFactor = 0.99; // Factor de desaceleración
const minimumSpeed = 0.01; // Velocidad mínima para que sea casi imperceptible

// Añadir a la escena
generateGlassElements();
createCubesArray();
scene.add(ambientLight);

function animate() {
  // Actualizar los controles
  // controls.update();

  // Incrementar el progreso y desacelerar
  if (speed > minimumSpeed) {
    speed *= slowdownFactor;
  } else {
    speed = minimumSpeed; // Mantener la velocidad mínima
  }

  progress += speed;

  const time = progress * 0.0001;
  camera.rotation.z = Math.sqrt(time % 10);
  if (camera.position.y > 120) {
    camera.position.y -= Math.sqrt(time / 100);
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
