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

const default_text = `let brd=JXG.JSXGraph.initBoard(gid,{axis:true,showCopyRight:false,boundingbox:[-4,4,4,-4]});`;

let editor = monaco.editor.create(code, {
    value: default_text,
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

run_code(default_text);

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

const url = new URLSearchParams(location.search);
if (url.get("code")) {
    editor.setValue(url.get("code"));
    run_code(url.get("code"));
}

const s = {
    angle: ["angle"],
    arc: ["arc"],
    arrow: ["arrow"],
    axis: ["axis"],
    bisector: ["bisector"],
    boxplot: ["boxplot"],
    button: ["button"],
    cardinalspline: ["cardinalspline"],
    chart: ["chart"],
    checkbox: ["checkbox"],
    circle: ["circle"],
    circumcircle: ["circumcircle"],
    circumcirclearc: ["circumcirclearc"],
    circumcirclesector: ["circumcirclesector"],
    comb: ["comb"],
    conic: ["conic"],
    curve: ["curve"],
    curvedifference: ["curvedifference"],
    curveintersection: ["curveintersection"],
    curveunion: ["curveunion"],
    ellipse: ["ellipse"],
    functiongraph: ["functiongraph"],
    glider: ["glider"],
    grid: ["grid"],
    group: ["group"],
    hatch: ["hatch"],
    hyperbola: ["hyperbola"],
    image: ["image"],
    inequality: ["inequality"],
    input: ["input"],
    integral: ["integral"],
    intersection: ["intersection"],
    line: ["line"],
    line1: ["line", { straightFirst: false, straightLast: true }],
    line2: ["line", { straightFirst: false, straightLast: false }],
    metapostspline: ["metapostspline"],
    midpoint: ["midpoint"],
    minorArc: ["minorArc"],
    mirrorelement: ["mirrorelement"],
    normal: ["normal"],
    parabola: ["parabola"],
    perpendicular: ["perpendicular"],
    plot: ["plot"],
    point: ["point"],
    polygon: ["polygon"],
    polygonalchain: ["polygonalchain"],
    regularpolygon: ["regularpolygon"],
    reflection: ["reflection"],
    riemannsum: ["riemannsum"],
    sector: ["sector"],
    semicircle: ["semicircle"],
    segment: ["segment"],
    slider: ["slider"],
    slopetriangle: ["slopetriangle"],
    stepfunction: ["stepfunction"],
    tangent: ["tangent"],
    tapemeasure: ["tapemeasure"],
    text: ["text"],
    ticks: ["ticks"],
    tracecurve: ["tracecurve"],
    transform: ["transform"],
    turtle: ["turtle"],
    view3d: ["view3d"],
};

monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems: function (model, position) {
        let x = [];
        for (let i in s) {
            x.push({
                label: i,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: `let ${s[i][0]}$1 = brd.create("${s[i][0]}", [\${2:p1}, \${3:p2}]${
                    s[i][1] ? `, ${JSON.stringify(s[i][1])}` : ""
                })`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            });
        }
        return {
            suggestions: x,
        };
    },
});
