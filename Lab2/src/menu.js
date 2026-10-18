
export function setupMenu(editor) {
    const menuButtons = document.querySelectorAll(".menu-trigger");

    function closeMenus() {
        menuButtons.forEach((button) => {
            button.setAttribute("aria-expanded", "false");
            document.getElementById(button.getAttribute("aria-controls")).hidden = true;
        });
    }

    menuButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const isOpen = button.getAttribute("aria-expanded") === "true";
            closeMenus();

            if (!isOpen) {
                button.setAttribute("aria-expanded", "true");
                document.getElementById(button.getAttribute("aria-controls")).hidden = false;
            }
        });
    });

    const options = document.querySelectorAll(".shape-option");

    function updateSelection() {
        options.forEach((option) => {
            const selected = option.dataset.shape === editor.selectedType;
            option.querySelector(".check").textContent = selected ? "✓" : "";
            option.setAttribute("aria-pressed", String(selected));
        });
    }

    options.forEach((option) => {
        option.addEventListener("click", () => {
            editor.setType(option.dataset.shape);
            updateSelection();
            closeMenus();
        });
    });

    updateSelection();

    document.getElementById("clear-canvas").addEventListener("click", () => {
        editor.clear();
        closeMenus();
    });

    document.getElementById("save-canvas").addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = editor.canvas.toDataURL("image/png");
        link.download = "Lab2-malunok.png";
        link.click();
        closeMenus();
    });

    const helpDialog = document.getElementById("help-dialog");

    document.getElementById("show-help").addEventListener("click", () => {
        closeMenus();
        helpDialog.showModal();
    });

    document.addEventListener("pointerdown", (event) => {
        if (!event.target.closest(".menu-group")) closeMenus();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenus();
    });
}
