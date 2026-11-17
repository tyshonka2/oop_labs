import { Shape } from "./Shape.js";

export class RectangleShape extends Shape {
    path(ctx) {
        ctx.rect(
            Math.min(this.x1, this.x2),
            Math.min(this.y1, this.y2),
            Math.abs(this.x2 - this.x1),
            Math.abs(this.y2 - this.y1)
        );
    }

    show(ctx) {
        ctx.save();
        ctx.beginPath();
        this.path(ctx);
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
    }
}
