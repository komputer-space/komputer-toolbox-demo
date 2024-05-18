import * as THREE from "three";

const containerElement = document.getElementById("app");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let object;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
containerElement.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionalLight);
directionalLight.position.z = 5;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
object = cube;

camera.position.z = 5;

animate();

export function replaceObject(newObject) {
  console.log("replace");
  scene.remove(object);
  scene.add(newObject);
  console.log(newObject);
  // adjust transformations
  // newObject.scale.set(7, 7, 7);
  // newObject.children.forEach((child) => {
  //   child.translateY(-0.15);
  // });
  object = newObject;
}

export function animate() {
  object.rotation.x += 0.01;
  object.rotation.y += 0.01;
  renderer.render(scene, camera);
}
