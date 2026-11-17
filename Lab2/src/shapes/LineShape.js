import { Shape } from "./Shape.js";

export class LineShape extends Shape {
    path(ctx) {
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
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
