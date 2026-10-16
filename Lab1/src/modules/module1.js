import { closeDialog, showResult } from "../utils.js";
export function work1() {
    const button = document.getElementById("work1");

    button.addEventListener("click", function () {
        closeDialog();

        const dialog = document.createElement("dialog");
        dialog.className = "dialog-window";

        dialog.innerHTML = `
            <form class="dialog-content">
                <h2>Робота1 — введення тексту</h2>
                <p>Введіть текст у поле нижче.</p>

                <label class="field-label" for="text-input">
                    Ваш текст
                </label>

                <input
                    id="text-input"
                    class="text-input"
                    type="text"
                    required
                >

                <div class="dialog-actions">
                    <button type="submit" class="button-primary">
                        Так
                    </button>

                    <button type="button" class="button-secondary">
                        Відміна
                    </button>
                </div>
            </form>
        `;

        document.body.append(dialog);
        dialog.show();

        dialog.querySelector("form").addEventListener("submit", function (event) {
            event.preventDefault();

            const input = dialog.querySelector(".text-input");
            const text = input.value.trim();

            if (text === "") {
                input.value = "";
                input.reportValidity();
                return;
            }

            showResult("Робота1", text);
            closeDialog();
        });

        dialog.querySelector(".button-secondary").addEventListener("click", function () {
            closeDialog();
        });
    });
}

