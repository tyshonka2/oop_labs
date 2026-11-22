import { RectangleShape } from "./RectangleShape.js";
import { LineShape } from "./LineShape.js";

const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];

export class CubeShape extends RectangleShape {
    #back = new RectangleShape(0, 0, 0, 0);
    #edges = CORNERS.map(() => new LineShape(0, 0, 0, 0));

    path(ctx) {
        super.path(ctx);
        this.#placeParts();

        this.#back.path(ctx);
        this.#edges.forEach((edge) => edge.path(ctx));
    }

    show(ctx) {
        super.show(ctx);
        this.#placeParts();

        this.#back.show(ctx);
        this.#edges.forEach((edge) => edge.show(ctx));
    }

    #placeParts() {
        const halfWidth = Math.abs(this.x2 - this.x1);
        const halfHeight = Math.abs(this.y2 - this.y1);
        const offset = (halfWidth + halfHeight) * 0.4;

        const backX = this.x1 + offset;
        const backY = this.y1 - offset;
        this.#back.set(backX, backY, backX + halfWidth, backY + halfHeight);

        CORNERS.forEach(([sx, sy], i) => {
            const x = this.x1 + sx * halfWidth;
            const y = this.y1 + sy * halfHeight;
            this.#edges[i].set(x, y, x + offset, y - offset);
        });
    }
}
