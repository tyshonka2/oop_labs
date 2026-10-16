import { closeDialog, showResult } from "../utils.js";
export function work2() {
    const button = document.getElementById("work2");

    button.addEventListener("click", function () {
        closeDialog();

        const dialog = document.createElement("dialog");
        dialog.className = "dialog-window";

        dialog.innerHTML = `
            <form class="dialog-content">
                <h2>Робота2 — вибір числа</h2>
                <p>Оберіть число від 1 до 100.</p>

                <div class="number-panel">
                    Поточне значення:
                    <span class="current-number">1</span>
                </div>

                <div
                    class="horizontal-scroll"
                    tabindex="0"
                    role="scrollbar"
                    aria-label="Вибір числа"
                    aria-valuemin="1"
                    aria-valuemax="100"
                    aria-valuenow="1"
                >
                    <div class="horizontal-scroll-content"></div>
                </div>

                <div class="scroll-scale">
                    <span>1</span>
                    <span>100</span>
                </div>

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

        const scrollbar = dialog.querySelector(".horizontal-scroll");
        const numberText = dialog.querySelector(".current-number");

        let number = 1;

        scrollbar.addEventListener("scroll", function () {
            const maxScroll = scrollbar.scrollWidth - scrollbar.clientWidth;

            if (maxScroll > 0) {
                number = 1 + Math.round(scrollbar.scrollLeft / maxScroll * 99);
            }

            numberText.textContent = number;
            scrollbar.setAttribute("aria-valuenow", number);
        });

        dialog.querySelector("form").addEventListener("submit", function (event) {
            event.preventDefault();

            showResult("Робота2", number);
            closeDialog();
        });

        dialog.querySelector(".button-secondary").addEventListener("click", function () {
            closeDialog();
        });
    });
}
