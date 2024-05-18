import "./styles/global.scss";
import { setupCounter } from "./counter.js";
import { initFileLoader } from "./fileLoader.js";
import * as debugLayer from "./debugLayer.js";
import { replaceObject, animate } from "./threeViewer.js";

const app = {
  viewMode: false,
};

function setup() {
  setupCounter(document.querySelector("#counter"));
  initFileLoader();
  debugLayer.initDebugLayer();
  debugLayer.addObject(app);
  setupKeyInput();

  const serialButton = document.getElementById("serial-button");
  serialButton.onclick = () => {
    console.log("click");
  };

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
  }
}

function toggleViewMode() {
  console.log("toggle view mode");
  app.viewMode = !app.viewMode;
}

// ---------

export function importGlTF(object) {
  replaceObject(object);
}

export function importImage(url) {
  document.getElementById("img").src = url;
}
