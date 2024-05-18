import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { importGlTF, importImage } from "./main";

const gltfLoader = new GLTFLoader();

const dropZone = document.getElementById("dropzone");

export function initFileLoader() {
  console.log("init file loader");
  dropZone.ondrop = dropHandler;
  dropZone.ondragover = dragOverHandler;
  dropZone.ondragleave = dragLeaveHandler;
}

export function initFileUpload() {
  console.log("init");
  dropZone.ondrop = dropHandler;
  dropZone.ondragover = dragOverHandler;
  dropZone.ondragleave = dragLeaveHandler;
}

function dropHandler(e) {
  console.log("File(s) dropped");
  // Prevent default behavior (Prevent file from being opened)
  e.preventDefault();
  dropZone.classList.remove("active");
  const file = e.dataTransfer.files[0];
  console.log(file);
  if (file) {
    const fileExtension = file.name.split(".").pop();
    console.log("file extension: " + fileExtension);

    switch (fileExtension) {
      case "jpg" ||
        "jpeg" ||
        "png" ||
        "webp" ||
        "JPG" ||
        "JPEG" ||
        "PNG" ||
        "WEBP":
        console.log("filetype: image");
        readFile(file, processImage);
        break;
      case "glb" || "gltf":
        console.log("filetype: gltf");
        readFile(file, processGlTF);
        break;
      default:
        console.log("not a valid file");
        return;
    }
  }
}

function dragOverHandler(e) {
  // console.log("File(s) in drop zone");
  e.preventDefault();
  dropZone.classList.add("active");
}

function dragLeaveHandler(e) {
  console.log("drag end");
  e.preventDefault();
  dropZone.classList.remove("active");
}

function readFile(file, processor) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const url = e.target.result;
    processor(url);
  };
  reader.readAsDataURL(file);
}

function processGlTF(url) {
  loadGLTF(url).then((object) => {
    importGlTF(object);
  });
}

function processImage(url) {
  importImage(url);
}

function loadExampleGLTF(exmpleName) {
  // return loadGLTF("/data/" + objectName + ".glb");
}

function loadGLTF(url) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      url,
      (gltf) => {
        resolve(gltf.scene);
      },
      undefined,
      function (error) {
        console.log("could not load object");
        console.error(error);
        reject();
      }
    );
  });
}
