import { Graph } from "./graph.js";

class Object3 {
    #graph;
    #status;

    constructor() {
        this.#graph = new Graph(document.getElementById("graph"));
        this.#status = document.getElementById("status");

        window.addEventListener("message", (event) => this.#onMessage(event));
        window.addEventListener("resize", () => this.#graph.draw());
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
        } else if (message.type === "draw") {
            await this.#readAndDraw();
        }
    }

    async #readAndDraw() {
        try {
            window.focus();
            const points = parsePoints(await navigator.clipboard.readText());

            if (points.length === 0) {
                throw new Error("у буфері обміну немає точок");
            }

            this.#graph.setPoints(points);
            this.#status.textContent = `Дані прочитано з буфера обміну: ${points.length} точок`;
            this.#sendToManager("done", { count: points.length });
        } catch (error) {
            this.#status.textContent = `Не вдалося прочитати буфер обміну: ${error.message}`;
            this.#sendToManager("error", {
                text: `Object3: не вдалося прочитати буфер обміну (${error.message})`,
                reason: document.hasFocus() ? "other" : "focus"
            });
        }
    }
}

function parsePoints(text) {
    const points = [];

    for (const line of text.split(/\r?\n/)) {
        const parts = line.trim().split(/[\s,;]+/);
        if (parts.length !== 2) continue;

        const x = Number(parts[0]);
        const y = Number(parts[1]);
        if (Number.isInteger(x) && Number.isInteger(y)) {
            points.push({ x, y });
        }
    }

    return points;
}

new Object3();
