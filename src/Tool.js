import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { ThreeExporter } from "./ThreeExporter";
import { FileImporter } from "./FileImporter";
import { InfoLayer } from "./InfoLayer";

export class Tool {
  constructor(canvas) {
    this.transparencyMode = false;
    this.freeze = false;
    this.currentFilter = 0;

    this.exporter = new ThreeExporter();
    this.loader = new FileImporter(this);

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
        let importedObject = gltf.scene;
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
