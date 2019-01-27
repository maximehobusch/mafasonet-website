let CONST = {};//constants
let f = function(x,y) {//function
    return Math.sqrt(x*x+y*y);
}
let c = {};
c.r = function(v) {//number toRed
    return Math.round((Math.sin(v)+1)*127.5);
}
c.g = function(v) {//number toGreen
    return Math.round((Math.sin(v*1.4)+1)*127.5);
}
c.b = function(v) {//number toBlue
    return Math.round((Math.sin(v*3)+1)*127.5);
}
c.a = function(v) {//number toAlpha
    return 255;
}

function calc(ox,oy,sx,sy,nx,ny) {
    let idata = new Uint8ClampedArray(nx*ny*4);
    for (let my = 0; my < ny; my++) for (let mx = 0; mx < nx; mx++) {
        let v = f(ox+sx*mx,oy+sy*my);
        let ps = (mx+my*nx)*4;
        idata[ps  ] = c.r(v);
        idata[ps+1] = c.g(v);
        idata[ps+2] = c.b(v);
        idata[ps+3] = c.a(v);
    }
    return idata;
}
function softCalc(ox,oy,sx,sy,nx,ny, ninner) {
    let idata = new Uint8ClampedArray(nx*ny*4);
    let ninnerSq = ninner*ninner;
    for (let my = 0; my < ny; my++) for (let mx = 0; mx < nx; mx++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        for (let dy = 0; dy < ninner; dy++) for (let dx = 0; dx < ninner; dx++) {
                let v = f(ox+sx*(mx+dx/ninner),oy+sy*(my+dy/ninner));
                r = r + c.r(v);
                g = g + c.g(v);
                b = b + c.b(v);
                a = a + c.a(v);
        }
        let ps = (mx+my*nx)*4;
        idata[ps  ] = r/ninnerSq;
        idata[ps+1] = g/ninnerSq;
        idata[ps+2] = b/ninnerSq;
        idata[ps+3] = a/ninnerSq;
    }
    return idata;
}


self.addEventListener('message', message);
function message(e) {
    let o = e.data;
    if (o.action == "set") {
        if (o.variable == "const") {
            let kys = Object.keys(o.value);
            for (let i = 0; i < kys.length; i++) CONST[kys[i]] = o.value[kys[i]];
        } else if (o.variable == "f") {
            f = new Function("x","y",o.value);
        } else if (o.variable == "c") {
            c = {"r":new Function("v",o.value.r),"g":new Function("v",o.value.g),"b":new Function("v",o.value.b),"a":new Function("v",o.value.a)};
        }
        self.postMessage({"type":"status","value":"set done!"});
    } else if (o.action == "calc") {
        let rt;
        if (o.ninner == undefined || o.ninner == 1) {
            rt = calc(o.ox,o.oy,o.sx,o.sy,o.nx,o.ny);
        } else {
            rt = softCalc(o.ox,o.oy,o.sx,o.sy,o.nx,o.ny, o.ninner);
        }
        self.postMessage({"type":"imagedata","ox":o.ox,"oy":o.oy,"sx":o.sx,"sy":o.sy,"nx":o.nx,"ny":o.ny,"value":rt});
    } else self.postMessage({"type":"status","value":"unknown Action " + o.action});
}
