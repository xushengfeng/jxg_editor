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

let X = "x",
    Y = "y",
    p = "点",
    f = "函数",
    n = "数字",
    l = "线",
    ar = "数组",
    str = "字符",
    cir = "圆",
    cur = "曲线",
    el = "元素",
    conic = "圆锥曲线";

const s = {
    angle: ["angle", [p, p, p]],
    arc: ["arc", [p, p, p]],
    arrow: ["arrow", [p, p]],
    axis: ["axis", [p, p]],
    arrowparallel: ["arrowparallel", [p, p, p]],
    bisector: ["bisector", [p, p, p]],
    bisectorlines: ["bisectorlines", [l, l]],
    boxplot: ["boxplot", [ar, n, n]],
    button: ["button", [X, Y, str, f]],
    cardinalspline: ["cardinalspline", [ar, f, str]],
    chart: ["chart", [ar]],
    checkbox: ["checkbox", [X, Y, str]],
    circle: ["circle", [p, n]],
    circle1: ["circle", [p, p]],
    circle2: ["circle", [p, l]],
    circle3: ["circle", [p, cir]],
    circumcenter: ["circumcenter", [p, p, p]],
    circumcircle: ["circumcircle", [p, p, p]],
    circumcirclearc: ["circumcirclearc", [p, p, p]],
    circumcirclesector: ["circumcirclesector", [p, p, p]],
    comb: ["comb", [p, p]],
    conic: ["conic", [p, p, p, p, p]],
    conic1: ["conic", ["A", "C", "F", "B/2", "D/2", "E/2"]],
    curve: ["curve", [p]],
    // curve3d: ["curve3d", [p]],
    curvedifference: ["curvedifference", [cur, cur]],
    curveintersection: ["curveintersection", [cur, cur]],
    curveunion: ["curveunion", [cur, cur]],
    derivative: ["derivative", [cur]],
    ellipse: ["ellipse", [p, p, p]],
    ellipse1: ["ellipse", [p, p, n]],
    functiongraph: ["functiongraph", [f]],
    // functiongraph3d: ["functiongraph3d", [f]],
    glider: ["glider", [n, n, el]],
    grid: ["grid", []],
    group: ["group", [p]],
    hatch: ["hatch", [l, n]],
    hyperbola: ["hyperbola", [p, p, p]],
    hyperbola1: ["hyperbola", [p, p, n]],
    image: ["image", [str, [X, Y], [n, n]]],
    incenter: ["incenter", [p, p, p]],
    incircle: ["incircle", [p, p, p]],
    inequality: ["inequality", [l + "|" + f]],
    inequality1: ["inequality", [l + "|" + f], { inverse: true }],
    input: ["input", [X, Y, str, str]],
    integral: ["integral", [ar, cur]],
    intersection: ["intersection", [l + "|" + cir, l + "|" + cir, "0|1"]],
    legend: ["legend", [X, Y]],
    line: ["line", [p, p]],
    line1: ["line", [p, p], { straightFirst: false, straightLast: true }],
    line_f: ["line", ["a", "b", "c"], { straightFirst: false, straightLast: false }],
    locus: ["locus", [p]],
    majorarc: ["majorarc", [p, p, p]],
    majorsector: ["majorsector", [p, p, p]],
    metapostspline: ["metapostspline", [ar, "obj"]],
    midpoint: ["midpoint", [p, p]],
    midpoint1: ["midpoint", [l]],
    minorarc: ["minorarc", [p, p, p]],
    minorsector: ["minorsector", [p, p, p]],
    mirrorelement: ["mirrorelement", [el, p]],
    nonreflexangle: ["nonreflexangle", [p, p, p]],
    normal: ["normal", [el, p]],
    otherintersection: ["otherintersection", [l + "|" + cir, l + "|" + cir, p]],
    parabola: ["parabola", [p, l]],
    parallel: ["parallel", [l, p]],
    parallelpoint: ["parallelpoint", [p, p, p]],
    parallelpoint1: ["parallelpoint", [l, p]],
    perpendicular: ["perpendicular", [l, p]],
    perpendicularpoint: ["perpendicularpoint", [l, p]],
    perpendicularsegment: ["perpendicularsegment", [l, p]],
    plot: ["plot", []],
    point: ["point", [X, Y]],
    polarline: ["polarline", [conic, p]],
    polepoint: ["polepoint", [conic, p]],
    polygon: ["polygon", [p]],
    polygonalchain: ["polygonalchain", [p]],
    reflexangle: ["reflexangle", [p, p, p]],
    regularpolygon: ["regularpolygon", [p, p, n]],
    reflection: ["reflection", [el, l]],
    riemannsum: ["riemannsum", [f, n]],
    sector: ["sector", [p, p, p]],
    semicircle: ["semicircle", [p, p]],
    segment: ["segment", [p, p]],
    slider: [
        "slider",
        [
            [X, Y],
            [X, Y],
            [n, n, n],
        ],
    ],
    slopetriangle: ["slopetriangle", [l, p]],
    stepfunction: ["stepfunction", []],
    tangent: ["tangent", ["glider"]],
    tapemeasure: [
        "tapemeasure",
        [
            [X, Y],
            [X, Y],
        ],
    ],
    text: ["text", [X, Y, str]],
    ticks: ["ticks", [l + "|" + cur]],
    tracecurve: ["tracecurve", ["glider", p]],
    transform: ["transform", []],
    turtle: ["turtle", []],
    view3d: ["view3d", []],
};

monaco.languages.registerCompletionItemProvider("javascript", {
    provideCompletionItems: function (model, position) {
        let x = [];
        for (let i in s) {
            let n = 1;
            let p = JSON.stringify(s[i][1], (k, v) => {
                if (typeof v == "string") {
                    n++;
                    return `\${${n}:${v}}`;
                }
                return v;
            });
            p = p.replaceAll('"', "");
            x.push({
                label: i,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: `let \${1:${s[i][0]}} = brd.create("${s[i][0]}", ${p}${
                    s[i][2] ? `, ${JSON.stringify(s[i][2])}` : ""
                })`,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            });
        }
        return {
            suggestions: x,
        };
    },
});
