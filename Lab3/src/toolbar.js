export class Toolbar {
    #window;
    #buttons;

    constructor(mainWindow) {
        this.#window = mainWindow;
        this.#buttons = document.querySelectorAll(".tool-button");

        this.#buttons.forEach((button) => {
            button.addEventListener("click", () => this.#onButtonClick(button));
        });
    }

    select(type) {
        this.#buttons.forEach((button) => {
            const active = button.dataset.shape === type;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    #onButtonClick(button) {
        this.#window.setType(button.dataset.shape);
    }
}