import { GraphicEditor } from "./editor.js";
import { setupMenu } from "./menu.js";

const editor = new GraphicEditor(document.getElementById("drawing-canvas"));
setupMenu(editor);
