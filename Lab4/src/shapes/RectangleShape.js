import { Shape } from "./Shape.js";

export class RectangleShape extends Shape {
    path(ctx) {
        const halfWidth = Math.abs(this.x2 - this.x1);
        const halfHeight = Math.abs(this.y2 - this.y1);

        ctx.rect(
            this.x1 - halfWidth,
            this.y1 - halfHeight,
            halfWidth * 2,
            halfHeight * 2
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
