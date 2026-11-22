const MAX_SHAPES = 129;

export class MyEditor {
    #canvas;
    #ctx;
    #objects = new Array(MAX_SHAPES).fill(null);
    #count = 0;
    #ShapeClass = null;
    #current = null;
    #handlers;

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");

        this.#handlers = {
            resize: () => this.#resizeCanvas(),
            pointerdown: (event) => this.#onMouseDown(event),
            pointermove: (event) => this.#onMouseMove(event),
            pointerup: (event) => this.#onMouseUp(event),
            pointercancel: () => this.#cancel()
        };

        window.addEventListener("resize", this.#handlers.resize);
        canvas.addEventListener("pointerdown", this.#handlers.pointerdown);
        canvas.addEventListener("pointermove", this.#handlers.pointermove);
        canvas.addEventListener("pointerup", this.#handlers.pointerup);
        canvas.addEventListener("pointercancel", this.#handlers.pointercancel);

        this.#resizeCanvas();
    }

    start(ShapeClass) {
        this.#ShapeClass = ShapeClass;
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

    destroy() {
        window.removeEventListener("resize", this.#handlers.resize);
        this.#canvas.removeEventListener("pointerdown", this.#handlers.pointerdown);
        this.#canvas.removeEventListener("pointermove", this.#handlers.pointermove);
        this.#canvas.removeEventListener("pointerup", this.#handlers.pointerup);
        this.#canvas.removeEventListener("pointercancel", this.#handlers.pointercancel);

        this.#objects.fill(null);
        this.#count = 0;
        this.#current = null;
        this.#ShapeClass = null;
        this.#ctx = null;
        this.#canvas = null;
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

    #addShape(shape) {
        if (this.#count >= MAX_SHAPES) return;

        this.#objects[this.#count] = shape;
        this.#count++;
    }

    #onMouseDown(event) {
        if (event.button !== 0 || !this.#ShapeClass || this.#count >= MAX_SHAPES) return;

        const point = this.#position(event);
        const shape = new this.#ShapeClass(point.x, point.y, point.x, point.y);

        if (shape.isOneClick()) {
            this.#addShape(shape);
            this.#render();
            return;
        }

        this.#current = shape;
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
