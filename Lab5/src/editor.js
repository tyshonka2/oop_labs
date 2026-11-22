const MAX_SHAPES = 129;

export class MyEditor {
    static #instance = null;
    static #creating = false;

    #canvas;
    #ctx;
    #objects = new Array(MAX_SHAPES).fill(null);
    #count = 0;
    #ShapeClass = null;
    #current = null;
    #selected = -1;
    #listeners = [];
    #handlers;

    static getInstance(canvas) {
        if (!MyEditor.#instance) {
            MyEditor.#creating = true;
            MyEditor.#instance = new MyEditor(canvas);
            MyEditor.#creating = false;
        }

        return MyEditor.#instance;
    }

    constructor(canvas) {
        if (!MyEditor.#creating) {
            throw new Error("MyEditor — Singleton, використовуйте MyEditor.getInstance()");
        }

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

    get selected() {
        return this.#selected;
    }

    addListener(listener) {
        this.#listeners.push(listener);
    }

    start(ShapeClass) {
        this.#ShapeClass = ShapeClass;
        this.#cancel();
    }

    getShapes() {
        return this.#objects.slice(0, this.#count);
    }

    select(index) {
        this.#selected = index;
        this.#render();
    }

    remove(index) {
        if (index < 0 || index >= this.#count) return;

        this.#objects.copyWithin(index, index + 1, this.#count);
        this.#count--;
        this.#objects[this.#count] = null;

        if (this.#selected === index) this.#selected = -1;
        else if (this.#selected > index) this.#selected--;

        this.#changed();
    }

    load(shapes) {
        this.#objects.fill(null);
        this.#count = 0;
        this.#selected = -1;
        this.#current = null;

        shapes.forEach((shape) => this.#addShape(shape));
        this.#changed();
    }

    clear() {
        this.#objects.fill(null);
        this.#count = 0;
        this.#selected = -1;
        this.#current = null;
        this.#changed();
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
        this.#listeners = [];
        this.#ctx = null;
        this.#canvas = null;

        MyEditor.#instance = null;
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

    #changed() {
        this.#render();
        this.#listeners.forEach((listener) => listener());
    }

    #onMouseDown(event) {
        if (event.button !== 0 || !this.#ShapeClass || this.#count >= MAX_SHAPES) return;

        const point = this.#position(event);
        const shape = new this.#ShapeClass(point.x, point.y, point.x, point.y);

        if (shape.isOneClick()) {
            this.#addShape(shape);
            this.#changed();
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

        const shape = this.#current;
        this.#current = null;

        if (shape.isEmpty()) {
            this.#render();
            return;
        }

        this.#addShape(shape);
        this.#changed();
    }

    #cancel() {
        this.#current = null;
        this.#render();
    }

    #render() {
        const ctx = this.#ctx;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, this.#canvas.clientWidth, this.#canvas.clientHeight);

        if (this.#selected >= 0) {
            ctx.save();
            ctx.strokeStyle = "rgba(37, 99, 235, 0.55)";
            ctx.lineWidth = 8;
            ctx.beginPath();
            this.#objects[this.#selected].path(ctx);
            ctx.stroke();
            ctx.restore();
        }

        for (let i = 0; i < this.#count; i++) {
            this.#objects[i].show(ctx);
        }

        if (this.#current) {
            this.#current.showTrail(ctx);
        }
    }
}
