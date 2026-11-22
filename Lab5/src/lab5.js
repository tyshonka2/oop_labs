import { MyEditor } from "./editor.js";
import { MyTable } from "./my_table.js";
import { Menu } from "./menu.js";
import { Toolbar } from "./toolbar.js";
import { toCSV, parseCSV } from "./csv.js";
import { PointShape } from "./shapes/PointShape.js";
import { LineShape } from "./shapes/LineShape.js";
import { RectangleShape } from "./shapes/RectangleShape.js";
import { EllipseShape } from "./shapes/EllipseShape.js";
import { LineOOShape } from "./shapes/LineOOShape.js";
import { CubeShape } from "./shapes/CubeShape.js";

const TITLE = "Лабораторна робота №5";

const SHAPES = {
    point: { ShapeClass: PointShape, name: "Крапка" },
    line: { ShapeClass: LineShape, name: "Лінія" },
    rectangle: { ShapeClass: RectangleShape, name: "Прямокутник" },
    ellipse: { ShapeClass: EllipseShape, name: "Еліпс" },
    lineoo: { ShapeClass: LineOOShape, name: "Лінія з кружечками" },
    cube: { ShapeClass: CubeShape, name: "Куб" }
};

class MainWindow {
    #editor;
    #table;
    #menu;
    #toolbar;
    #helpDialog;
    #fileInput;

    constructor() {
        this.#editor = MyEditor.getInstance(document.getElementById("drawing-canvas"));
        this.#table = new MyTable("Таблиця об’єктів");
        this.#menu = new Menu(this);
        this.#toolbar = new Toolbar(this);
        this.#helpDialog = document.getElementById("help-dialog");
        this.#fileInput = document.getElementById("csv-file");

        this.#editor.addListener(() => this.#updateTable());
        this.#table.onSelect = (index) => this.#editor.select(index);
        this.#table.onDelete = (index) => this.#editor.remove(index);
        this.#table.onClose = () => this.#menu.setTableChecked(false);
        this.#fileInput.addEventListener("change", () => this.#onFileChosen());

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

    toggleTable() {
        if (this.#table.isOpen()) {
            this.#table.hide();
        } else {
            this.#table.show();
        }

        this.#menu.setTableChecked(this.#table.isOpen());
    }

    clear() {
        this.#editor.clear();
    }

    openCSV() {
        this.#fileInput.value = "";
        this.#fileInput.click();
    }

    saveCSV() {
        const records = this.#editor.getShapes().map((shape) => ({
            type: this.#typeOf(shape),
            x1: shape.x1,
            y1: shape.y1,
            x2: shape.x2,
            y2: shape.y2
        }));

        const blob = new Blob([toCSV(records)], { type: "text/csv" });
        this.#download(URL.createObjectURL(blob), "Lab5-obiekty.csv");
    }

    savePNG() {
        this.#download(this.#editor.toPNG(), "Lab5-malunok.png");
    }

    showHelp() {
        this.#helpDialog.showModal();
    }

    destroy() {
        if (!this.#editor) return;

        this.#table.destroy();
        this.#editor.destroy();
        this.#table = null;
        this.#editor = null;
    }

    async #onFileChosen() {
        const file = this.#fileInput.files[0];
        if (!file) return;

        const shapes = parseCSV(await file.text())
            .filter((record) => SHAPES[record.type])
            .map((record) => new SHAPES[record.type].ShapeClass(record.x1, record.y1, record.x2, record.y2));

        this.#editor.load(shapes);
    }

    #updateTable() {
        this.#table.clear();

        for (const shape of this.#editor.getShapes()) {
            const name = SHAPES[this.#typeOf(shape)].name;
            this.#table.add(name, shape.x1, shape.y1, shape.x2, shape.y2);
        }

        this.#table.select(this.#editor.selected);
    }

    #typeOf(shape) {
        return Object.keys(SHAPES).find((type) => SHAPES[type].ShapeClass === shape.constructor);
    }

    #download(url, fileName) {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
    }
}

new MainWindow();
