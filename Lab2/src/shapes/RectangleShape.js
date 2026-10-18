import { Shape } from "./Shape.js";

export class RectangleShape extends Shape {
    draw(ctx) {
        const left = Math.min(this.x1, this.x2);
        const top = Math.min(this.y1, this.y2);
        const width = Math.abs(this.x2 - this.x1);
        const height = Math.abs(this.y2 - this.y1);
        ctx.strokeStyle = "#111111";
        ctx.lineWidth = 2;
        ctx.strokeRect(left, top, width, height);
    }
}
