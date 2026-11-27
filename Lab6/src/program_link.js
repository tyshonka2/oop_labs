const TIMEOUT = 15000;
const PING_INTERVAL = 300;

export class ProgramLink {
    onMessage = null;

    #name;
    #url;
    #window = null;
    #waiters = [];

    constructor(name, url) {
        this.#name = name;
        this.#url = new URL(url, location.href).href;

        window.addEventListener("message", (event) => this.#onWindowMessage(event));
    }

    get name() {
        return this.#name;
    }

    open(left, top, width, height) {
        const features = `popup,left=${left},top=${top},width=${width},height=${height}`;

        if (!this.#window || this.#window.closed) {
            this.#window = window.open("", this.#name, features);
            if (!this.#window) return false;

            if (this.#window.location.href === "about:blank") {
                this.#window.location.href = this.#url;
            }
        }

        try {
            this.#window.moveTo(left, top);
            this.#window.resizeTo(width, height);
        } catch {
        }

        return true;
    }

    reopen(left, top, width, height) {
        this.close();
        this.#window = window.open(this.#url, this.#name, `popup,left=${left},top=${top},width=${width},height=${height}`);
        return Boolean(this.#window);
    }

    async connect() {
        const ready = this.#wait("ready");
        const timer = setInterval(() => this.send("ping"), PING_INTERVAL);
        this.send("ping");

        try {
            await ready;
        } finally {
            clearInterval(timer);
        }
    }

    send(type, data = {}) {
        this.#window?.postMessage({ type, ...data }, "*");
    }

    request(type, data, replyType) {
        const reply = this.#wait(replyType);
        this.send(type, data);
        return reply;
    }

    focus() {
        this.#window?.focus();
    }

    close() {
        if (this.#window && !this.#window.closed) {
            this.#window.close();
        }

        this.#window = null;
        this.#rejectAll(new Error(`${this.#name} закрито`));
    }

    #wait(type) {
        return new Promise((resolve, reject) => {
            const waiter = { type, resolve, reject };

            waiter.timer = setTimeout(() => {
                this.#waiters = this.#waiters.filter((item) => item !== waiter);
                reject(new Error(`${this.#name} не відповідає`));
            }, TIMEOUT);

            this.#waiters.push(waiter);
        });
    }

    #rejectAll(error) {
        this.#waiters.forEach((waiter) => {
            clearTimeout(waiter.timer);
            waiter.reject(error);
        });
        this.#waiters = [];
    }

    #onWindowMessage(event) {
        if (!this.#window || event.source !== this.#window) return;

        const message = event.data;
        this.onMessage?.(message);

        if (message.type === "error") {
            const error = new Error(message.text);
            error.reason = message.reason;
            this.#rejectAll(error);
            return;
        }

        const index = this.#waiters.findIndex((waiter) => waiter.type === message.type);
        if (index < 0) return;

        const [waiter] = this.#waiters.splice(index, 1);
        clearTimeout(waiter.timer);
        waiter.resolve(message);
    }
}
