import "./styles/global.scss";
import { setupCounter } from "./counter.js";
import { initFileLoader } from "./fileLoader.js";
import * as debugLayer from "./debugLayer.js";
import { replaceObject, animate, exportScene } from "./threeViewer.js";
import { SketchManual } from "./SketchManual.js";
import { CanvasExporter } from "./CanvasExporter.js";
import { SerialInput } from "./SerialInput.js";

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
  app.serialInput = new SerialInput(115200);

  setupCounter(document.querySelector("#counter"));
  initFileLoader();
  setupKeyInput();
  debugLayer.initDebugLayer();
  debugLayer.addObject(app);
  debugLayer.addObject(app.serialInput);

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
  if (document.activeElement != document.body) document.activeElement.blur();
  if (app.serialInput.connected) console.log(app.serialInput.serialData);
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
    case "KeyO":
      exportScene();
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
