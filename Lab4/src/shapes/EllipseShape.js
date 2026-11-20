import { Shape } from "./Shape.js";

export class EllipseShape extends Shape {
    path(ctx) {
        ctx.ellipse(
            (this.x1 + this.x2) / 2,
            (this.y1 + this.y2) / 2,
            Math.abs(this.x2 - this.x1) / 2,
            Math.abs(this.y2 - this.y1) / 2,
            0, 0, Math.PI * 2
        );
    }

    show(ctx) {
        ctx.save();
        ctx.beginPath();
        this.path(ctx);
        ctx.fillStyle = "#ffa500";
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}
