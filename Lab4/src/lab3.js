import { GraphicEditor } from "./editor.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";

const TITLE = "Лабораторна робота №3";

const SHAPE_NAMES = {
    point: "Крапка",
    line: "Лінія",
    rectangle: "Прямокутник",
    ellipse: "Еліпс"
};

class MainWindow {
    #editor;
    #menu;
    #toolbar;
    #helpDialog;

    constructor() {
        this.#editor = new GraphicEditor(document.getElementById("drawing-canvas"));
        this.#menu = new Menu(this);
        this.#toolbar = new Toolbar(this);
        this.#helpDialog = document.getElementById("help-dialog");

        this.setType("point");
    }

    setType(type) {
        this.#editor.setType(type);
        this.#toolbar.select(type);
        document.title = `${TITLE} — ${SHAPE_NAMES[type]}`;
    }

    clear() {
        this.#editor.clear();
    }

    savePNG() {
        const link = document.createElement("a");
        link.href = this.#editor.toPNG();
        link.download = "Lab3-malunok.png";
        link.click();
    }

    showHelp() {
        this.#helpDialog.showModal();
    }
}

new MainWindow();
