const MARGIN = { left: 60, right: 30, top: 25, bottom: 45 };

export class Graph {
    #canvas;
    #ctx;
    #points = [];

    constructor(canvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d");
    }

    setPoints(points) {
        this.#points = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
        this.draw();
    }

    draw() {
        const ctx = this.#ctx;
        const rect = this.#canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;

        this.#canvas.width = Math.max(1, Math.round(rect.width * ratio));
        this.#canvas.height = Math.max(1, Math.round(rect.height * ratio));
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        ctx.clearRect(0, 0, rect.width, rect.height);

        if (this.#points.length === 0) return;

        const xRange = niceRange(this.#points.map((point) => point.x));
        const yRange = niceRange(this.#points.map((point) => point.y));
        const width = rect.width - MARGIN.left - MARGIN.right;
        const height = rect.height - MARGIN.top - MARGIN.bottom;

        const toX = (x) => MARGIN.left + (x - xRange.min) / (xRange.max - xRange.min) * width;
        const toY = (y) => MARGIN.top + (yRange.max - y) / (yRange.max - yRange.min) * height;

        this.#drawGrid(xRange, yRange, toX, toY);
        this.#drawAxes(xRange, yRange, toX, toY);
        this.#drawLine(toX, toY);
    }

    #drawGrid(xRange, yRange, toX, toY) {
        const ctx = this.#ctx;

        ctx.save();
        ctx.strokeStyle = "#e3e9f3";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#5a6780";
        ctx.font = "12px Arial";

        for (let x = xRange.min; x <= xRange.max + 1e-9; x += xRange.step) {
            ctx.beginPath();
            ctx.moveTo(toX(x), toY(yRange.min));
            ctx.lineTo(toX(x), toY(yRange.max));
            ctx.stroke();
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(format(x), toX(x), toY(yRange.min) + 8);
        }

        for (let y = yRange.min; y <= yRange.max + 1e-9; y += yRange.step) {
            ctx.beginPath();
            ctx.moveTo(toX(xRange.min), toY(y));
            ctx.lineTo(toX(xRange.max), toY(y));
            ctx.stroke();
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(format(y), toX(xRange.min) - 8, toY(y));
        }

        ctx.restore();
    }

    #drawAxes(xRange, yRange, toX, toY) {
        const ctx = this.#ctx;
        const axisY = clamp(0, yRange.min, yRange.max);
        const axisX = clamp(0, xRange.min, xRange.max);

        ctx.save();
        ctx.strokeStyle = "#243452";
        ctx.fillStyle = "#243452";
        ctx.lineWidth = 1.5;
        ctx.font = "bold 14px Arial";

        arrow(ctx, toX(xRange.min), toY(axisY), toX(xRange.max) + 18, toY(axisY));
        arrow(ctx, toX(axisX), toY(yRange.min), toX(axisX), toY(yRange.max) - 18);

        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText("x", toX(xRange.max) + 18, toY(axisY) - 6);
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("y", toX(axisX) + 8, toY(yRange.max) - 20);

        ctx.restore();
    }

    #drawLine(toX, toY) {
        const ctx = this.#ctx;

        ctx.save();
        ctx.strokeStyle = "#2563eb";
        ctx.fillStyle = "#2563eb";
        ctx.lineWidth = 2;

        ctx.beginPath();
        this.#points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(toX(point.x), toY(point.y));
            else ctx.lineTo(toX(point.x), toY(point.y));
        });
        ctx.stroke();

        for (const point of this.#points) {
            ctx.beginPath();
            ctx.arc(toX(point.x), toY(point.y), 3.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }
}

function niceRange(values) {
    let min = Math.min(...values);
    let max = Math.max(...values);

    if (min === max) {
        min -= 1;
        max += 1;
    }

    const step = niceStep((max - min) / 8);
    return {
        min: Math.floor(min / step) * step,
        max: Math.ceil(max / step) * step,
        step
    };
}

function niceStep(rough) {
    const power = 10 ** Math.floor(Math.log10(rough));
    const fraction = rough / power;

    if (fraction <= 1) return power;
    if (fraction <= 2) return 2 * power;
    if (fraction <= 5) return 5 * power;
    return 10 * power;
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function format(value) {
    return String(Math.round(value * 1000) / 1000);
}

function arrow(ctx, x1, y1, x2, y2) {
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(angle - 0.4), y2 - 10 * Math.sin(angle - 0.4));
    ctx.lineTo(x2 - 10 * Math.cos(angle + 0.4), y2 - 10 * Math.sin(angle + 0.4));
    ctx.closePath();
    ctx.fill();
}
