import "./styles/global.scss";
import { TransparencyLayer } from "./TransparencyLayer.js";
import { Tool } from "./Tool.js";
import { SketchManual } from "./SketchManual.js";
import { CanvasExporter } from "./CanvasExporter.js";

import { setupCounter } from "./counter.js";
import { setupWorkspace } from "./workspaceHandler.js";

const app = {
  viewMode: false,
  inputActive: true,
  transparencyMode: false,
  smallScreen: false,
  touchDevice: false,
  domElement: document.getElementById("app"),
  canvas: document.getElementById("canvas"),
};

function setup() {
  app.sketchManual = new SketchManual();
  app.canvasExporter = new CanvasExporter(app.canvas);
  // app.serialInput = new SerialInput(115200);
  app.tool = new Tool(app.canvas);

  app.transparencyLayer = new TransparencyLayer();
  app.transparencyLayer.addObject(app, "Application");
  app.transparencyLayer.addObject(app.transparencyLayer, "Transparency Layer");
  app.transparencyLayer.addObject(app.sketchManual.settings, "Settings");
  app.transparencyLayer.addObject(app.tool, "Tool");

  setTransparencyMode(true);

  setupInputs();
  document.onkeydown = processKeyInput;

  setupCounter(document.querySelector("#counter"));
  setupWorkspace();

  window.onresize = resize;
  resize();
  update();
}

function update() {
  app.tool.update();
  app.transparencyLayer.updateDebug();
  requestAnimationFrame(update);
}

setup();

// ---------

function processKeyInput(e) {
  if (app.inputActive) {
    document.activeElement.blur();
    switch (e.code) {
      case "KeyF":
        toggleViewMode();
        break;
      case "Space":
        toggleTransparencyMode();
        break;
      case "KeyR":
        app.canvasExporter.toggleRecord();
        break;
      case "KeyS":
        if (app.viewMode) app.canvasExporter.saveImage();
        break;
      case "KeyO":
        if (app.viewMode) app.tool.exportScene();
        break;
      case "Tab":
        if (!app.viewMode) app.tool.loadNewExample();
        break;
      case "Escape":
        window.location.replace("https://toolbox.komputer.space");
        break;
    }
  }
}

function setupInputs() {
  // prevent tool inputs while typing into any text input fields
  const inputs = Array.from(document.querySelectorAll("input[type=text]"));
  inputs.forEach((input) => {
    input.onfocus = () => {
      app.inputActive = false;
    };
    input.onblur = () => {
      app.inputActive = true;
    };
  });
}

function toggleViewMode() {
  console.log("toggle view mode");
  app.viewMode = !app.viewMode;
  const viewModeIndicator = document.getElementById("view-mode-indicator");
  viewModeIndicator.style.display = app.viewMode ? "flex" : "none";
  app.tool.setViewMode(app.viewMode);
}

function toggleTransparencyMode() {
  console.log("toggle transparency layer");
  const active = !app.transparencyMode;
  setTransparencyMode(active);
}

function setTransparencyMode(val) {
  app.transparencyMode = val;
  app.transparencyLayer.setActive(val);
  app.tool.setTransparencyMode(val);
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  app.tool.resize(width, height);
  if (width < 600) {
    app.smallScreen = true;
    app.sketchManual.setSmallScreenGuides(true);
  } else {
    app.smallScreen = false;
    app.sketchManual.setSmallScreenGuides(false);
  }
}
