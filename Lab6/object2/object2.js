class Object2 {
    #points = [];
    #status;
    #table;

    constructor() {
        this.#status = document.getElementById("status");
        this.#table = document.getElementById("points");

        window.addEventListener("message", (event) => this.#onMessage(event));
        this.#sendToManager("ready");
    }

    #sendToManager(type, data = {}) {
        window.opener?.postMessage({ type, ...data }, "*");
    }

    async #onMessage(event) {
        if (!window.opener || event.source !== window.opener) return;

        const message = event.data;

        if (message.type === "ping") {
            this.#sendToManager("ready");
        } else if (message.type === "generate") {
            await this.#generate(message);
        }
    }

    async #generate({ nPoint, xMin, xMax, yMin, yMax }) {
        this.#points = [];

        for (let i = 0; i < nPoint; i++) {
            this.#points.push({ x: randomInt(xMin, xMax), y: randomInt(yMin, yMax) });
        }

        this.#show();
        this.#status.textContent = `nPoint = ${nPoint}, x: ${xMin} … ${xMax}, y: ${yMin} … ${yMax}`;

        try {
            window.focus();
            await navigator.clipboard.writeText(this.#toText());
            this.#status.textContent += " — дані записано в буфер обміну";
            this.#sendToManager("done", { count: this.#points.length });
        } catch (error) {
            this.#status.textContent += " — не вдалося записати в буфер обміну";
            this.#sendToManager("error", {
                text: `Object2: не вдалося записати в буфер обміну (${error.message})`,
                reason: document.hasFocus() ? "other" : "focus"
            });
        }
    }

    #show() {
        const body = this.#table.tBodies[0];
        body.replaceChildren();

        this.#points.forEach((point, index) => {
            const row = body.insertRow();
            row.insertCell().textContent = index + 1;
            row.insertCell().textContent = point.x;
            row.insertCell().textContent = point.y;
        });

        this.#table.hidden = false;
    }

    #toText() {
        const lines = this.#points.map((point) => `${point.x}\t${point.y}`);
        return ["x\ty", ...lines].join("\n");
    }
}

function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

new Object2();
