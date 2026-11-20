export class Menu {
    #window;
    #triggers;

    constructor(mainWindow) {
        this.#window = mainWindow;
        this.#triggers = document.querySelectorAll(".menu-trigger");

        this.#triggers.forEach((button) => {
            button.addEventListener("click", () => this.#onTriggerClick(button));
        });

        document.querySelectorAll(".shape-option").forEach((item) => {
            item.addEventListener("click", () => this.#onShapeClick(item));
        });

        document.getElementById("clear-canvas").addEventListener("click", () => this.#onClearClick());
        document.getElementById("save-canvas").addEventListener("click", () => this.#onSaveClick());
        document.getElementById("show-help").addEventListener("click", () => this.#onHelpClick());

        document.addEventListener("pointerdown", (event) => this.#onDocumentPointerDown(event));
        document.addEventListener("keydown", (event) => this.#onKeyDown(event));
    }

    close() {
        this.#triggers.forEach((button) => {
            button.setAttribute("aria-expanded", "false");
            document.getElementById(button.getAttribute("aria-controls")).hidden = true;
        });
    }

    #onTriggerClick(button) {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        this.close();

        if (!isOpen) {
            button.setAttribute("aria-expanded", "true");
            document.getElementById(button.getAttribute("aria-controls")).hidden = false;
        }
    }

    #onShapeClick(item) {
        this.#window.setType(item.dataset.shape);
        this.close();
    }

    #onClearClick() {
        this.#window.clear();
        this.close();
    }

    #onSaveClick() {
        this.#window.savePNG();
        this.close();
    }

    #onHelpClick() {
        this.close();
        this.#window.showHelp();
    }

    #onDocumentPointerDown(event) {
        if (!event.target.closest(".menu-group")) {
            this.close();
        }
    }

    #onKeyDown(event) {
        if (event.key === "Escape") {
            this.close();
        }
    }
}
