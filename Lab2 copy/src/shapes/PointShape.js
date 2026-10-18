import { Shape } from "./Shape.js";

export class PointShape extends Shape {
    draw(ctx) {
        ctx.fillStyle = "#111111";
        ctx.beginPath();
        ctx.arc(this.x1, this.y1, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}
