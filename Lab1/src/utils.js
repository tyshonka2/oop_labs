export function closeDialog() {
    document.querySelector(".dialog-window")?.remove();
}

export function openDialog(html) {
    closeDialog();

    const dialog = document.createElement("dialog");
    dialog.className = "dialog-window";
    dialog.innerHTML = html;

    document.body.append(dialog);
    dialog.show();

    dialog.querySelector('[data-action="cancel"]')?.addEventListener("click", closeDialog);

    dialog.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeDialog();
        }
    });

    return dialog;
}

export function showResult(workName, value) {
    document.getElementById("result-source").textContent = workName;
    document.getElementById("result").textContent = value;
}