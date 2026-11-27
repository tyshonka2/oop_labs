export class Menu {
    #app;
    #triggers;

    constructor(app) {
        this.#app = app;
        this.#triggers = document.querySelectorAll(".menu-trigger");

        this.#triggers.forEach((button) => {
            button.addEventListener("click", () => this.#onTriggerClick(button));
        });

        document.getElementById("run-task").addEventListener("click", () => this.#onRunClick());
        document.getElementById("close-programs").addEventListener("click", () => this.#onCloseProgramsClick());
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

    #onRunClick() {
        this.close();
        this.#app.showParams();
    }

    #onCloseProgramsClick() {
        this.close();
        this.#app.closePrograms();
    }

    #onHelpClick() {
        this.close();
        this.#app.showHelp();
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
