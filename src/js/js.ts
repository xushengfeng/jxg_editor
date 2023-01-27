import JXG from "jsxgraph";
import * as monaco from "monaco-editor";

const code = document.getElementById("code");

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

editor.onDidChangeModelContent((e) => {
    console.log(editor.getValue());
    eval(`{let gid = 'board';${editor.getValue()}}`);
});
