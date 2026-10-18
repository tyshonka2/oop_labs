
import { PointShape } from "./shapes/PointShape.js";
import { LineShape } from "./shapes/LineShape.js";
import { RectangleShape } from "./shapes/RectangleShape.js";
import { EllipseShape } from "./shapes/EllipseShape.js";

export class GraphicEditor {
    constructor() {
        this.canvas = document.getElementById("drawing-canvas");
        this.ctx = this.canvas.getContext("2d");

        
        this.onChange = (count) => {
            const counter = document.getElementById("shape-count");
            if (counter) counter.textContent = count;
        };

        this.objects = Array(128).fill(null);
        this.count = 0;
        this.selectedType = "point";
        this.startPoint = null;
        this.endPoint = null;

        this.resizeCanvas();

        window.addEventListener("resize", () => this.resizeCanvas());

        this.canvas.addEventListener("pointerdown", (event) => this.startDrawing(event));
        this.canvas.addEventListener("pointermove", (event) => this.moveDrawing(event));
        this.canvas.addEventListener("pointerup", (event) => this.finishDrawing(event));
        this.canvas.addEventListener("pointercancel", () => this.cancelDrawing());

        this.render();
    }

    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;

        this.canvas.width = Math.max(1, Math.round(rect.width * ratio));
        this.canvas.height = Math.max(1, Math.round(rect.height * ratio));

        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.render();
    }

    setType(type) {
        this.selectedType = type;
        this.cancelDrawing();
    }

    position(event) {
        const rect = this.canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    createShape(type, a, b) {
        if (type === "point") return new PointShape(a.x, a.y, a.x, a.y);
        if (type === "line") return new LineShape(a.x, a.y, b.x, b.y);
        if (type === "rectangle") return new RectangleShape(a.x, a.y, b.x, b.y);

        return new EllipseShape(a.x, a.y, b.x, b.y);
    }

    addShape(shape) {
        if (this.count >= this.objects.length) return;

        this.objects[this.count] = shape;
        this.count++;

        this.onChange(this.count);
        this.render();
    }

    startDrawing(event) {
        if (event.button !== 0 || this.count >= this.objects.length) return;

        const point = this.position(event);

        if (this.selectedType === "point") {
            this.addShape(this.createShape("point", point, point));
            return;
        }

        this.startPoint = point;
        this.endPoint = point;

        this.canvas.setPointerCapture(event.pointerId);
    }

    moveDrawing(event) {
        if (!this.startPoint) return;

        this.endPoint = this.position(event);
        this.render();
    }

    finishDrawing(event) {
        if (!this.startPoint) return;

        this.endPoint = this.position(event);

        const shape = this.createShape(
            this.selectedType,
            this.startPoint,
            this.endPoint
        );

        this.startPoint = null;
        this.endPoint = null;

        this.addShape(shape);
    }

    cancelDrawing() {
        this.startPoint = null;
        this.endPoint = null;
        this.render();
    }

    clear() {
        this.objects.fill(null);
        this.count = 0;

        this.cancelDrawing();
        this.onChange(0);
    }

    render() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.ctx.clearRect(0, 0, width, height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < this.count; i++) {
            this.objects[i].draw(this.ctx);
        }

        if (this.startPoint && this.endPoint) {
            this.ctx.save();
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "#000000";
            this.ctx.setLineDash([]);
            this.ctx.beginPath();

            if (this.selectedType === "line") {
                this.ctx.moveTo(this.startPoint.x, this.startPoint.y);
                this.ctx.lineTo(this.endPoint.x, this.endPoint.y);
            } else if (this.selectedType === "rectangle") {
                this.ctx.rect(
                    Math.min(this.startPoint.x, this.endPoint.x),
                    Math.min(this.startPoint.y, this.endPoint.y),
                    Math.abs(this.endPoint.x - this.startPoint.x),
                    Math.abs(this.endPoint.y - this.startPoint.y)
                );
            } else {
                this.ctx.ellipse(
                    this.startPoint.x,
                    this.startPoint.y,
                    Math.abs(this.endPoint.x - this.startPoint.x),
                    Math.abs(this.endPoint.y - this.startPoint.y),
                    0, 0, Math.PI * 2
                );
            }

            this.ctx.stroke();
            this.ctx.restore();
        }
    }
}
