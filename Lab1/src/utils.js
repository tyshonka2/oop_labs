export function closeDialog() {
    document.querySelector(".dialog-window")?.remove();
}

export function showResult(workName, value) {
    document.getElementById("result-source").textContent = workName;
    document.getElementById("result").textContent = value;
}
