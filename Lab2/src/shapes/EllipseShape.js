import { Shape } from "./Shape.js";

export class EllipseShape extends Shape {
    path(ctx) {
        ctx.ellipse(
            this.x1,
            this.y1,
            Math.abs(this.x2 - this.x1),
            Math.abs(this.y2 - this.y1),
            0, 0, Math.PI * 2
        );
    }

    show(ctx) {
        ctx.save();
        ctx.beginPath();
        this.path(ctx);
        ctx.fillStyle = "#f9a8d4";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}