import { Shape } from "./Shape.js";

export class EllipseShape extends Shape {
    draw(ctx) {
        const radiusX = Math.abs(this.x2 - this.x1);
        const radiusY = Math.abs(this.y2 - this.y1);
        ctx.beginPath();
        ctx.ellipse(this.x1, this.y1, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#f9a8d4";
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }
}
