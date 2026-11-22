export class MyTable {
    onSelect = null;
    onDelete = null;
    onClose = null;

    #dialog;
    #body;
    #deleteButton;
    #selected = -1;
    #drag = null;

    constructor(title) {
        this.#dialog = document.createElement("dialog");
        this.#dialog.className = "table-window";
        this.#dialog.innerHTML = `
            <div class="table-header">
                <span class="table-title"></span>
                <button type="button" class="table-close" aria-label="Закрити">×</button>
            </div>
            <div class="table-scroll">
                <table>
                    <thead>
                        <tr><th>Назва</th><th>x1</th><th>y1</th><th>x2</th><th>y2</th></tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
            <div class="table-footer">
                <button type="button" class="table-delete" disabled>Видалити об’єкт</button>
            </div>
        `;
        this.#dialog.querySelector(".table-title").textContent = title;
        document.body.append(this.#dialog);

        this.#body = this.#dialog.querySelector("tbody");
        this.#deleteButton = this.#dialog.querySelector(".table-delete");
        const header = this.#dialog.querySelector(".table-header");

        this.#body.addEventListener("click", (event) => this.#onRowClick(event));
        this.#deleteButton.addEventListener("click", () => this.#onDeleteClick());
        this.#dialog.querySelector(".table-close").addEventListener("click", () => this.#onCloseClick());
        header.addEventListener("pointerdown", (event) => this.#onDragStart(event));
        header.addEventListener("pointermove", (event) => this.#onDragMove(event));
        header.addEventListener("pointerup", () => this.#onDragEnd());
    }

    show() {
        this.#dialog.show();
    }

    hide() {
        this.#dialog.close();
    }

    isOpen() {
        return this.#dialog.open;
    }

    clear() {
        this.#body.replaceChildren();
        this.select(-1);
    }

    add(name, x1, y1, x2, y2) {
        const row = document.createElement("tr");

        for (const value of [name, x1, y1, x2, y2]) {
            const cell = document.createElement("td");
            cell.textContent = typeof value === "number" ? Math.round(value) : value;
            row.append(cell);
        }

        this.#body.append(row);
    }

    select(index) {
        this.#selected = index;

        [...this.#body.rows].forEach((row, i) => {
            row.classList.toggle("selected", i === index);
        });

        this.#deleteButton.disabled = index < 0;
    }

    destroy() {
        this.hide();
        this.#dialog.remove();
        this.onSelect = null;
        this.onDelete = null;
        this.onClose = null;
    }

    #onRowClick(event) {
        const row = event.target.closest("tr");
        if (!row) return;

        this.select(row.sectionRowIndex);
        this.onSelect?.(this.#selected);
    }

    #onDeleteClick() {
        if (this.#selected >= 0) {
            this.onDelete?.(this.#selected);
        }
    }

    #onCloseClick() {
        this.hide();
        this.onClose?.();
    }

    #onDragStart(event) {
        if (event.target.closest("button")) return;

        const rect = this.#dialog.getBoundingClientRect();
        this.#drag = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    #onDragMove(event) {
        if (!this.#drag) return;

        this.#dialog.style.left = `${event.clientX - this.#drag.dx}px`;
        this.#dialog.style.top = `${event.clientY - this.#drag.dy}px`;
    }

    #onDragEnd() {
        this.#drag = null;
    }
}
