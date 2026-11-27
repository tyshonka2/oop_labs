import { Menu } from "./menu.js";
import { ParamsDialog } from "./params_dialog.js";
import { ProgramLink } from "./program_link.js";

class Lab6 {
    #menu;
    #paramsDialog;
    #helpDialog;
    #log;
    #object2;
    #object3;
    #busy = false;

    constructor() {
        this.#menu = new Menu(this);
        this.#paramsDialog = new ParamsDialog();
        this.#helpDialog = document.getElementById("help-dialog");
        this.#log = document.getElementById("log");

        this.#object2 = new ProgramLink("Object2", "./object2/index.html");
        this.#object3 = new ProgramLink("Object3", "./object3/index.html");

        this.#paramsDialog.onRun = (params) => this.#run(params);
        window.addEventListener("pagehide", (event) => {
            if (!event.persisted) this.closePrograms();
        });
    }

    showParams() {
        if (this.#busy) return;
        this.#paramsDialog.show();
    }

    showHelp() {
        this.#helpDialog.showModal();
    }

    closePrograms() {
        this.#object2.close();
        this.#object3.close();
    }

    async #run(params) {
        this.#busy = true;
        this.#log.replaceChildren();

        const opened3 = this.#object3.open(...this.#place(this.#object3));
        const opened2 = this.#object2.open(...this.#place(this.#object2));

        if (!opened2 || !opened3) {
            this.#write("Браузер заблокував вікна Object2 / Object3. Дозвольте спливаючі вікна для цього сайту й спробуйте ще раз.", "error");
            this.#busy = false;
            return;
        }

        try {
            const generated = await this.#ask(this.#object2, "generate", params,
                `generate (nPoint=${params.nPoint}, x: ${params.xMin}…${params.xMax}, y: ${params.yMin}…${params.yMax})`);
            this.#write(`← Object2: done — ${generated.count} точок записано в буфер обміну`, "receive");

            const drawn = await this.#ask(this.#object3, "draw", {}, "draw");
            this.#write(`← Object3: done — графік побудовано за ${drawn.count} точками`, "receive");

            this.#write("Завдання виконано. Можна запустити ще раз.");
        } catch (error) {
            this.#write(error.message, "error");
        } finally {
            this.#busy = false;
        }
    }

    async #ask(program, type, data, label) {
        try {
            return await this.#connectAndRequest(program, type, data, label);
        } catch (error) {
            if (error.reason !== "focus") throw error;

            this.#write(`${program.name} неактивне — Lab6 відкриває його заново`);
            if (!program.reopen(...this.#place(program))) {
                throw new Error(`Браузер заблокував повторне відкриття ${program.name}. Дозвольте спливаючі вікна для цього сайту.`);
            }

            return await this.#connectAndRequest(program, type, data, label);
        }
    }

    async #connectAndRequest(program, type, data, label) {
        this.#write(`Пошук програми ${program.name}…`);
        await program.connect();
        this.#write(`← ${program.name}: ready`, "receive");

        program.focus();
        this.#write(`→ ${program.name}: ${label}`, "send");
        return await program.request(type, data, "done");
    }

    #place(program) {
        const left = screen.availLeft ?? 0;
        const top = (screen.availTop ?? 0) + Math.round(screen.availHeight * 0.3);
        const height = Math.round(screen.availHeight * 0.7);
        const width2 = Math.round(screen.availWidth * 0.4);

        if (program === this.#object2) {
            return [left, top, width2, height];
        }

        return [left + width2, top, screen.availWidth - width2, height];
    }

    #write(text, kind = "") {
        const item = document.createElement("li");
        item.textContent = text;
        if (kind) item.className = kind;
        this.#log.append(item);
    }
}

new Lab6();
