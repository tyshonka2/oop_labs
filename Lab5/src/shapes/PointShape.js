import { Shape } from "./Shape.js";

export class PointShape extends Shape {
    isOneClick() {
        return true;
    }

    path(ctx) {
        ctx.arc(this.x1, this.y1, 3, 0, Math.PI * 2);
    }

    show(ctx) {
        ctx.save();
        ctx.beginPath();
        this.path(ctx);
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.restore();
    }
}
