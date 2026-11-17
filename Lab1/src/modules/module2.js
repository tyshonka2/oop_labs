import { openDialog, closeDialog, showResult } from "../utils.js";

const MIN = 1;
const MAX = 100;

const DIALOG_HTML = `
    <form class="dialog-content">
        <h2>Робота2 — вибір числа</h2>
        <p>Оберіть число від ${MIN} до ${MAX}.</p>

        <div class="number-panel">
            Поточне значення:
            <span class="current-number">${MIN}</span>
        </div>

        <div
            class="horizontal-scroll"
            tabindex="0"
            role="scrollbar"
            aria-orientation="horizontal"
            aria-label="Вибір числа"
            aria-valuemin="${MIN}"
            aria-valuemax="${MAX}"
            aria-valuenow="${MIN}"
        >
            <div class="horizontal-scroll-content"></div>
        </div>

        <div class="scroll-scale">
            <span>${MIN}</span>
            <span>${MAX}</span>
        </div>

        <div class="dialog-actions">
            <button type="submit" class="button-primary">Так</button>
            <button type="button" class="button-secondary" data-action="cancel">Відміна</button>
        </div>
    </form>
`;

export function showNumberDialog() {
    const dialog = openDialog(DIALOG_HTML);
    const form = dialog.querySelector("form");
    const scrollbar = dialog.querySelector(".horizontal-scroll");
    const numberText = dialog.querySelector(".current-number");

    let number = MIN;

    function maxScroll() {
        return scrollbar.scrollWidth - scrollbar.clientWidth;
    }

    function setNumber(value) {
        number = value;
        numberText.textContent = number;
        scrollbar.setAttribute("aria-valuenow", number);
    }

    function onScroll() {
        if (maxScroll() > 0) {
            setNumber(MIN + Math.round(scrollbar.scrollLeft / maxScroll() * (MAX - MIN)));
        }
    }

    function onKeyDown(event) {
        let next = number;

        if (event.key === "ArrowRight") next = number + 1;
        else if (event.key === "ArrowLeft") next = number - 1;
        else if (event.key === "Home") next = MIN;
        else if (event.key === "End") next = MAX;
        else return;

        event.preventDefault();
        next = Math.min(MAX, Math.max(MIN, next));
        setNumber(next);
        scrollbar.scrollLeft = (next - MIN) / (MAX - MIN) * maxScroll();
    }

    function onOk(event) {
        event.preventDefault();
        showResult("Робота2", number);
        closeDialog();
    }
    scrollbar.addEventListener("scroll", onScroll);
    scrollbar.addEventListener("keydown", onKeyDown);
    form.addEventListener("submit", onOk);
    scrollbar.focus();
}

