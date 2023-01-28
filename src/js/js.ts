import JXG from "jsxgraph";
import loader from "@monaco-editor/loader";
loader.config({ paths: { vs: "https://unpkg.com/monaco-editor@0.34.1/min/vs" } }); // or local
let monaco = await loader.init();
import jxg_type from "../../lib/index.d.ts?raw";
import "//unpkg.com/mathlive";
import { ComputeEngine } from "@cortex-js/compute-engine";

const code = document.getElementById("code");
const mfe = document.querySelector("math-field");
const add_math = document.getElementById("add_math");
const add_function = document.getElementById("add_function");

if (JXG) {
}

let editor = monaco.editor.create(code, {
    value: `let brd=JXG.JSXGraph.initBoard(gid,{axis:true,showCopyRight:false,boundingbox:[-4,4,4,-4]});`,
    language: "javascript",
    minimap: { enabled: false },
    automaticLayout: true,
    codeLens: true,
    colorDecorators: true,
    contextmenu: false,
    readOnly: false,
    formatOnPaste: true,
    overviewRulerBorder: false,
    scrollBeyondLastLine: true,
    fontSize: 12,
    wordWrap: "on",
});

monaco.languages.typescript.javascriptDefaults.addExtraLib(
    `${jxg_type}\ndeclare const JXG: JXG;declare const run_math: (code: string, v?: { [key: string]: number }) => viod;`
);
editor.onDidChangeModelContent((e) => {
    console.log(editor.getValue());
});

editor.onDidBlurEditorText(() => {
    run_code(editor.getValue());
});

function run_code(code: string) {
    eval(`{let gid = 'board';${code}}`);
}

function get_math_value() {
    // @ts-ignore
    return mfe.value as string;
}

add_math.onclick = () => {
    editor.trigger("keyboard", "type", { text: String(run_math(get_math_value())) });
    editor.focus();
};
add_function.onclick = () => {
    let code = `(x)=>run_math("${get_math_value().replaceAll("\\", "\\\\")}", {x})`;
    editor.trigger("keyboard", "type", { text: code });
    editor.focus();
};

const ce = new ComputeEngine();
let parse_o: { [key: string]: ReturnType<typeof ce.parse> } = {};
let run_math = (window["run_math"] = (code: string, v?: { [key: string]: number }) => {
    if (!v) v = {};
    let ex = parse_o[code];
    if (!ex) {
        ex = parse_o[code] = ce.parse(code);
    }
    let out = ex.subs(v).N().valueOf();
    return out;
});
