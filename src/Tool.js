import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { ThreeExporter } from "./ThreeExporter";
import { FileImporter } from "./FileImporter";
import { InfoLayer } from "./InfoLayer";

export class Tool {
  constructor(canvas) {
    this.transparencyMode = false;
    this.freeze = false;
    this.idle = false;

    this.exampleIndex = 0;
    this.examples = ["macintosh", "mate"];

    this.exporter = new ThreeExporter();
    this.importer = new FileImporter(this);

    this.infoLayer = new InfoLayer();

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    // -------

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.object;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    this.scene.add(directionalLight);
    directionalLight.position.z = 5;

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    this.object = cube;

    this.camera.position.z = 5;
  }

  // --- CORE METHODS

  update() {
    if (!this.freeze) {
      this.object.rotation.x += 0.01;
      this.object.rotation.y += 0.01;
    }
    if (this.idle) {
      this.object.rotation.z += 0.01;
    }

    this.renderer.render(this.scene, this.camera);
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  setViewMode(value) {
    this.freeze = value;
  }

  setTransparencyMode(value) {
    this.transparencyMode = value;
  }

  setIdleMode(value) {
    this.idle = value;
  }

  loadNewExample() {
    console.log("loading next example");
    this.exampleIndex++;
    if (this.exampleIndex >= this.examples.length) this.exampleIndex = 0;
    const fileName = this.examples[this.exampleIndex];
    this.importGlTF("/examples/" + fileName + ".glb");
  }

  // --- CUSTOM METHODS

  replaceObject(newObject) {
    console.log("replace");
    this.scene.remove(this.object);
    this.scene.add(newObject);
    console.log(newObject);
    // adjust transformations
    // newObject.scale.set(7, 7, 7);
    // newObject.children.forEach((child) => {
    //   child.translateY(-0.15);
    // });
    this.object = newObject;
  }

  adaptObjectToScene(object) {
    console.log("adapt");
    const box = new THREE.Box3().setFromObject(object);
    const offsetPosition = box.getCenter(new THREE.Vector3());
    const scaleFactor = 2 / box.getSize(new THREE.Vector3()).y;
    console.log(scaleFactor);
    const wrapperObject = new THREE.Group();
    wrapperObject.add(object);
    const adaptedPosition = object.position.clone().sub(offsetPosition);
    object.position.copy(adaptedPosition.multiplyScalar(scaleFactor));
    object.scale.multiplyScalar(scaleFactor);
    wrapperObject.traverse((obj) => {
      obj.receiveShadow = false;
      if (obj.isMesh) obj.geometry.computeVertexNormals();
    });
    console.log(wrapperObject);
    return wrapperObject;
  }

  // --- FILE EXPORTS

  exportScene() {
    this.exporter.exportGlTF(this.scene);
  }

  // --- FILE IMPORTS

  importGlTF(url) {
    this.infoLayer.setActive(true);
    this.gltfLoader.load(
      url,
      (gltf) => {
        let importedObject = this.adaptObjectToScene(gltf.scene);
        this.replaceObject(importedObject);
        this.infoLayer.setActive(false);
      },
      function (xhr) {
        this.infoLayer.showLoadingIndicator(
          Math.round((xhr.loaded / xhr.total) * 100)
        );
      }.bind(this),
      function (error) {
        console.log("could not load object");
        console.error(error);
      }
    );
  }

  importImage(url) {
    document.getElementById("img").src = url;
  }
}
