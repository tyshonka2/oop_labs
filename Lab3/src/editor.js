import { PointShape } from "./shapes/PointShape.js";
import { LineShape } from "./shapes/LineShape.js";
import { RectangleShape } from "./shapes/RectangleShape.js";
import { EllipseShape } from "./shapes/EllipseShape.js";

const SHAPE_CLASSES = {
    point: PointShape,
    line: LineShape,
    rectangle: RectangleShape,
    ellipse: EllipseShape
};

const MAX_SHAPES = 129;

export class GraphicEditor {
    #canvas;
    #ctx;
    #objects = new Array(MAX_SHAPES).fill(null);
    #count = 0;
    #type = "point";
    #current = null;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");

        this.#resizeCanvas();
        window.addEventListener("resize", () => this.#resizeCanvas());

        canvas.addEventListener("pointerdown", (event) => this.#onMouseDown(event));
        canvas.addEventListener("pointermove", (event) => this.#onMouseMove(event));
        canvas.addEventListener("pointerup", (event) => this.#onMouseUp(event));
        canvas.addEventListener("pointercancel", () => this.#cancel());
    }

    setType(type) {
        this.#type = type;
        this.#cancel();
    }

    clear() {
        this.#objects.fill(null);
        this.#count = 0;
        this.#cancel();
    }

    toPNG() {
        return this.#canvas.toDataURL("image/png");
    }

    #resizeCanvas() {
        const rect = this.#canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;

        this.#canvas.width = Math.max(1, Math.round(rect.width * ratio));
        this.#canvas.height = Math.max(1, Math.round(rect.height * ratio));
        this.#ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

        this.#render();
    }

    #position(event) {
        const rect = this.#canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    #createShape(point) {
        const ShapeClass = SHAPE_CLASSES[this.#type];
        return new ShapeClass(point.x, point.y, point.x, point.y);
    }

    #addShape(shape) {
        if (this.#count >= MAX_SHAPES) return;

        this.#objects[this.#count] = shape;
        this.#count++;
    }

    #onMouseDown(event) {
        if (event.button !== 0 || this.#count >= MAX_SHAPES) return;

        const point = this.#position(event);

        if (this.#type === "point") {
            this.#addShape(this.#createShape(point));
            this.#render();
            return;
        }

        this.#current = this.#createShape(point);
        this.#canvas.setPointerCapture(event.pointerId);
    }

    #onMouseMove(event) {
        if (!this.#current) return;

        const point = this.#position(event);
        this.#current.setEnd(point.x, point.y);
        this.#render();
    }

    #onMouseUp(event) {
        if (!this.#current) return;

        const point = this.#position(event);
        this.#current.setEnd(point.x, point.y);

        if (!this.#current.isEmpty()) {
            this.#addShape(this.#current);
        }

        this.#current = null;
        this.#render();
    }

    #cancel() {
        this.#current = null;
        this.#render();
    }

    #render() {
        const ctx = this.#ctx;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, this.#canvas.clientWidth, this.#canvas.clientHeight);

        for (let i = 0; i < this.#count; i++) {
            this.#objects[i].show(ctx);
        }

        if (this.#current) {
            this.#current.showTrail(ctx);
        }
    }
}
