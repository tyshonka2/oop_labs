import { MyEditor } from "./editor.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";
import { PointShape } from "./shapes/PointShape.js";
import { LineShape } from "./shapes/LineShape.js";
import { RectangleShape } from "./shapes/RectangleShape.js";
import { EllipseShape } from "./shapes/EllipseShape.js";

const TITLE = "Лабораторна робота №4";

const SHAPES = {
    point: { ShapeClass: PointShape, name: "Крапка" },
    line: { ShapeClass: LineShape, name: "Лінія" },
    rectangle: { ShapeClass: RectangleShape, name: "Прямокутник" },
    ellipse: { ShapeClass: EllipseShape, name: "Еліпс" }
};

class MainWindow {
    #editor;
    #menu;
    #toolbar;
    #helpDialog;

    constructor() {
        this.#editor = new MyEditor(document.getElementById("drawing-canvas"));
        this.#menu = new Menu(this);
        this.#toolbar = new Toolbar(this);
        this.#helpDialog = document.getElementById("help-dialog");

        window.addEventListener("pagehide", (event) => {
            if (!event.persisted) this.destroy();
        });

        this.setType("point");
    }

    setType(type) {
        const shape = SHAPES[type];

        this.#editor.start(shape.ShapeClass);
        this.#toolbar.select(type);
        document.title = `${TITLE} — ${shape.name}`;
    }

    clear() {
        this.#editor.clear();
    }

    savePNG() {
        const link = document.createElement("a");
        link.href = this.#editor.toPNG();
        link.download = "Lab4-malunok.png";
        link.click();
    }

    showHelp() {
        this.#helpDialog.showModal();
    }

    destroy() {
        if (!this.#editor) return;

        this.#editor.destroy();
        this.#editor = null;
    }
}

new MainWindow();
