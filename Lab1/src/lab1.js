import { showTextDialog } from "./modules/module1.js";
import { showNumberDialog } from "./modules/module2.js";

function initMenu() {
    document.getElementById("work1").addEventListener("click", showTextDialog);
    document.getElementById("work2").addEventListener("click", showNumberDialog);
}

initMenu();
