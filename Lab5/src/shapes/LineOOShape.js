import { LineShape } from "./LineShape.js";
import { EllipseShape } from "./EllipseShape.js";

const RADIUS = 7;

export class LineOOShape extends LineShape {
    #startCircle = new EllipseShape(0, 0, 0, 0);
    #endCircle = new EllipseShape(0, 0, 0, 0);

    path(ctx) {
        super.path(ctx);
        this.#placeCircles();

        ctx.moveTo(this.x1 + RADIUS, this.y1);
        this.#startCircle.path(ctx);
        ctx.moveTo(this.x2 + RADIUS, this.y2);
        this.#endCircle.path(ctx);
    }

    show(ctx) {
        super.show(ctx);
        this.#placeCircles();

        this.#startCircle.show(ctx);
        this.#endCircle.show(ctx);
    }

    #placeCircles() {
        this.#startCircle.set(this.x1 - RADIUS, this.y1 - RADIUS, this.x1 + RADIUS, this.y1 + RADIUS);
        this.#endCircle.set(this.x2 - RADIUS, this.y2 - RADIUS, this.x2 + RADIUS, this.y2 + RADIUS);
    }
}
