export class Shape {
    constructor(x1, y1, x2, y2) {
        if (new.target === Shape) {
            throw new Error("Shape — абстрактний клас, його не можна створити напряму");
        }

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    setEnd(x, y) {
        this.x2 = x;
        this.y2 = y;
    }

    isEmpty() {
        return this.x1 === this.x2 && this.y1 === this.y2;
    }

    path(ctx) {
        throw new Error("Метод path() потрібно перевизначити у класі-нащадку");
    }

    show(ctx) {
        throw new Error("Метод show() потрібно перевизначити у класі-нащадку");
    }

    showTrail(ctx) {
        ctx.save();
        ctx.strokeStyle = "#ff0000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        this.path(ctx);
        ctx.stroke();
        ctx.restore();
    }
}
