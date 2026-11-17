import { openDialog, closeDialog, showResult } from "../utils.js";

const DIALOG_HTML = `
    <form class="dialog-content">
        <h2>Робота1 — введення тексту</h2>
        <p>Введіть текст у поле нижче.</p>

        <label class="field-label" for="text-input">Ваш текст</label>
        <input id="text-input" class="text-input" type="text" required>

        <div class="dialog-actions">
            <button type="submit" class="button-primary">Так</button>
            <button type="button" class="button-secondary" data-action="cancel">Відміна</button>
        </div>
    </form>
`;

export function showTextDialog() {
    const dialog = openDialog(DIALOG_HTML);
    const form = dialog.querySelector("form");
    const input = dialog.querySelector(".text-input");
    input.focus();

    function onOk(event) {
        event.preventDefault();
        const text = input.value.trim();
        if (text === "") {
            input.value = "";
            input.reportValidity();
            return;
        }

        showResult("Робота1", text);
        closeDialog();
    }

    form.addEventListener("submit", onOk);
}

