const FIELDS = ["nPoint", "xMin", "xMax", "yMin", "yMax"];

export class ParamsDialog {
    onRun = null;

    #dialog;
    #form;
    #error;

    constructor() {
        this.#dialog = document.getElementById("params-dialog");
        this.#form = document.getElementById("params-form");
        this.#error = document.getElementById("params-error");

        this.#form.addEventListener("submit", (event) => this.#onSubmit(event));
        document.getElementById("params-cancel").addEventListener("click", () => this.#onCancel());
    }

    show() {
        this.#error.textContent = "";
        this.#dialog.showModal();
    }

    #read() {
        const params = {};

        for (const name of FIELDS) {
            const value = Number(this.#form.elements[name].value);
            if (this.#form.elements[name].value === "" || !Number.isInteger(value)) {
                throw new Error(`Поле ${name} має бути цілим числом`);
            }
            params[name] = value;
        }

        if (params.nPoint < 2 || params.nPoint > 1000) throw new Error("nPoint має бути від 2 до 1000");
        if (params.xMin >= params.xMax) throw new Error("xMin має бути меншим за xMax");
        if (params.yMin >= params.yMax) throw new Error("yMin має бути меншим за yMax");

        return params;
    }

    #onSubmit(event) {
        event.preventDefault();

        try {
            const params = this.#read();
            this.#dialog.close();
            this.onRun?.(params);
        } catch (error) {
            this.#error.textContent = error.message;
        }
    }

    #onCancel() {
        this.#dialog.close();
    }
}
