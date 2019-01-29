const EXAMPLES = {
    "mandelbrot":{"cam":{"x":-2.1043800000000004,"y":-1.3310000000000008,"z":192.33658903080388,"w":512,"h":512},"func":"let r = 0;\nlet i = 0;\nfor (let n = 0; n < 1000; n++) {\n    let ra = r;\n    r = r*r - i*i + x;\n    i = 2*ra*i + y;\n    if (r*r + i*i > 4) return n/10;\n}\nreturn Infinity;","cfunc":{"r":"if (v == Infinity) return 0;\nreturn Math.round((Math.sin(v-2.0943951023931953)+1)*127.5);","g":"if (v == Infinity) return 0;\nreturn Math.round((Math.sin(v-4.1887902047863905)+1)*127.5);","b":"if (v == Infinity) return 0;\nreturn Math.round((Math.sin(v)+1)*127.5);","a":"return 255;"},"quality":2},
    "juliaFraktal(0.353)":{"cam":{"x":-1.2100000000000002,"y":-1.2100000000000002,"z":211.57024793388427,"w":512,"h":512},"func":"let r = x;\nlet i = y;\nfor (let n = 0; n < 1000; n++) {\n    let ra = r;\n    r = r*r - i*i + 0.353;\n    i = 2*ra*i + 0.353;\n    if (r*r + i*i > 4) return n/100;\n}\nreturn Infinity;","cfunc":{"r":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.4)+1)*127.5);","g":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.3)+1)*127.5);","b":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.5)+1)*127.5);","a":"return 255;"},"quality":2},
    "juliaFraktal(0.35001)stelle":{"cam":{"x":0.21888084643038144,"y":-0.5725280916045761,"z":3356.1585130239882,"w":512,"h":512},"func":"let r = x;\nlet i = y;\nfor (let n = 0; n < 2000; n++) {\n    let ra = r;\n    r = r*r - i*i + 0.35001;\n    i = 2*ra*i + 0.35001;\n    if (r*r + i*i > 64) return n/4;\n}\nreturn Infinity;","cfunc":{"r":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.4)+1)*127.5);","g":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.3)+1)*127.5);","b":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.5)+1)*127.5);","a":"return 255;"},"quality":3},
    "kreuz":{"cam":{"x":-2.1435888100000016,"y":-1.460558848000001,"z":119.42588933369167,"w":512,"h":512},"func":"let xxa = x;\nlet yya = y;\nx = xxa*0.7071067811865476 + yya*0.7071067811865476;\ny = -xxa*0.7071067811865476 + yya*0.7071067811865476;\nfor (let i = 0; i < 100; i++) {\n    let xa = x;\n    x = x*x-y;\n    let ya = y;\n    y = y*y-xa;\n    if (x*x+y*y < 0.02) return i/12;\n}\nreturn Infinity;\n","cfunc":{"r":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*2.213-3.094395)+1)*127.5);\n    ","g":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*1.21-1.1887902)+1)*127.5);\n    ","b":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*2.9324)+1)*127.5);\n    ","a":"return 255;\n    "},"quality":1},
    "maximesliebe":{"cam":{"x":-1.1,"y":-1.1,"z":465.45454545454544,"w":1024,"h":1024},"func":"let r = x;\nlet i = y;\nfor (let n = 0; n < 1000; n++) {\n    let ra = r;\n    r = r*r - i*i + 0.2524;\n    i = 2*ra*i + 0;\n    if (r*r + i*i > 4) return n/40;\n}\nreturn Infinity;","cfunc":{"r":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*3.7)+1)*127.5);","g":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*4.3)+1)*127.5);","b":"if (v == Infinity) return 0;\nreturn Math.round((-Math.cos(v*0.9)+1)*127.5);","a":"return 255;"},"quality":2}
}
