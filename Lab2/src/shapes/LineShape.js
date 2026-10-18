import { Shape } from "./Shape.js";

export class LineShape extends Shape {
    draw(ctx) {
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}
