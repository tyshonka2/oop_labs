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
        document.getElementById("open-csv").addEventListener("click", () => this.#onOpenCSVClick());
        document.getElementById("save-csv").addEventListener("click", () => this.#onSaveCSVClick());
        document.getElementById("save-canvas").addEventListener("click", () => this.#onSaveClick());
        document.getElementById("toggle-table").addEventListener("click", () => this.#onTableClick());
        document.getElementById("show-help").addEventListener("click", () => this.#onHelpClick());

        document.addEventListener("pointerdown", (event) => this.#onDocumentPointerDown(event));
        document.addEventListener("keydown", (event) => this.#onKeyDown(event));
    }

    setTableChecked(checked) {
        const item = document.getElementById("toggle-table");
        item.classList.toggle("checked", checked);
        item.setAttribute("aria-checked", String(checked));
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

    #onOpenCSVClick() {
        this.close();
        this.#window.openCSV();
    }

    #onSaveCSVClick() {
        this.#window.saveCSV();
        this.close();
    }

    #onTableClick() {
        this.#window.toggleTable();
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
