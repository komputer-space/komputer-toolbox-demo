import "./styles/global.scss";
import { setupCounter } from "./counter.js";
import { initFileLoader } from "./fileLoader.js";
import * as debugLayer from "./debugLayer.js";
import { replaceObject, animate } from "./threeViewer.js";
import { SketchManual } from "./SketchManual.js";
import { CanvasExporter } from "./CanvasExporter.js";

const app = {
  viewMode: false,
  smallScreen: false,
  touchDevice: false,
  domElement: document.getElementById("app"),
  canvas: document.getElementById("canvas"),
};

function setup() {
  app.sketchManual = new SketchManual();
  app.canvasExporter = new CanvasExporter(app.canvas);

  setupCounter(document.querySelector("#counter"));
  initFileLoader();
  setupKeyInput();
  debugLayer.initDebugLayer();
  debugLayer.addObject(app);

  const serialButton = document.getElementById("serial-button");
  serialButton.onclick = () => {
    console.log("click");
  };

  window.onresize = resize;
  resize();

  update();
}

function update() {
  animate();
  debugLayer.updateDebug();
  requestAnimationFrame(update);
}

setup();

// ---------

function setupKeyInput() {
  document.onkeydown = processKeyInput;
}

function processKeyInput(e) {
  switch (e.code) {
    case "Space":
      toggleViewMode();
      break;
    case "KeyD":
      debugLayer.toggleDebugLayer();
      break;
    case "KeyR":
      app.canvasExporter.toggleRecord();
      break;
    case "KeyS":
      app.canvasExporter.saveImage();
      break;
  }
}

function toggleViewMode() {
  console.log("toggle view mode");
  app.viewMode = !app.viewMode;
}

function resize() {
  const width = window.innerWidth;
  if (width < 600) {
    app.smallScreen = true;
    app.sketchManual.setSmallScreenGuides(true);
  } else {
    app.smallScreen = false;
    app.sketchManual.setSmallScreenGuides(false);
  }
}

// ---------

export function importGlTF(object) {
  replaceObject(object);
}

export function importImage(url) {
  document.getElementById("img").src = url;
}
