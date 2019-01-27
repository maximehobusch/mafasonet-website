
function makeDraggable(elm,triggerElement,parentElement,onfocus) {
    if (onfocus == undefined) onfocus = function(elm) {};
    triggerElement.style.cursor = "grab";
    triggerElement.onmousedown = function(e) {
        let drx = e.clientX;
        let dry = e.clientY;
        triggerElement.style.cursor = "grabbing";
        parentElement.onmousemove = function(e) {
            let deltax =  drx - e.clientX;
            let deltay =  dry - e.clientY;
            elm.style.left = (elm.offsetLeft - deltax) + "px";
            elm.style.top = (elm.offsetTop - deltay) + "px";
            drx = e.clientX;
            dry = e.clientY;
        }
        parentElement.onmouseup = function() {
            parentElement.onmousemove = function() {};
            parentElement.onmouseup = function() {};
            triggerElement.style.cursor = "grab";
        }
        onfocus(elm);
    }
    elm.onmousedown = function() {onfocus(elm)};
}
function makeClosable(elm,triggerElement,onclose) {
    triggerElement.onclick = function() {
        elm.style.visibility = "hidden";
        if (onclose != undefined) onclose(elm);
    }
}

class WindowMeneger { 
    constructor(elm,valueElm) {
        this.elm = elm;
        this.valueElm = valueElm;
        this.bar = document.createElement("div");
        this.bar.innerHTML = "test, ich bin die BAR";
        this.bar.className = "mainBar";
        this.bar.style["font-size"] = "30px";
        this.bar.style["z-index"] = 10000;
        this.elm.insertBefore(this.bar,this.elm.firstChild);
        this.zinx = 1;
        this.ws = [];
    }
    addWindow(wnd,noAppendChild) {
        let current = this;
        this.ws.push(wnd);
        wnd.elm.style.top = (Math.floor(Math.random()*200)+40) + "px";
        wnd.elm.style.left = (Math.floor(Math.random()*200)+40) + "px";
        makeDraggable(wnd.elm,wnd.head,this.elm,function() {wnd.setZIndex(current.zinx++)});
        if (!noAppendChild) this.valueElm.appendChild(wnd.elm);
        wnd.onclose = function() {
            current.updateBar();
        }
        this.updateBar();
    }
    updateBar() {
        let current = this;
        this.bar.innerHTML = "";
        let ha = document.createElement("span");
        ha.style["background-color"] = "rgba(255,255,255,0.25)";
        ha.innerHTML = "X";
        ha.onmousedown = function(e) {
            current.hideAll();
        }
        this.bar.appendChild(ha);
        for (let i = 0; i < this.ws.length; i++) {
            let wnd = this.ws[i];
            let em = document.createElement("span");
            em.style["background-color"] = "rgba(255,255,255,0.25)";
            em.innerHTML = this.ws[i].name;
            em.onmousedown = function(e) {
                wnd.setZIndex(current.zinx++);
                wnd.setVisible(true);
            }
            this.bar.appendChild(document.createTextNode(" "));
            this.bar.appendChild(em);
        }
    }
    getWindowByName(n) {
        for (let i = 0; i < this.ws.length; i++) if (this.ws[i].name == n) return this.ws[i];
        return undefined;
    }
    hideAll() {
        for (let i = 0; i < this.ws.length; i++) this.ws[i].setVisible(false);
    }
}
class FjWindow {
    constructor(elm,name,head,headButtons) {
        let current = this;
        this.elm = elm;
        this.head = head;
        this.headButtons = headButtons;
        this.name = name;
        this.visible = true;
        this.onclose = function() {};
        if (this.headButtons.close != undefined) makeClosable(elm,headButtons.close,function(e) {current.visible = false; current.onclose(e)});
    }
    setZIndex(z) {
        this.elm.style["z-index"] = z;
    }
    setPosition(x,y) {
        this.elm.style.left = x + "px";
        this.elm.style.top = y + "px";
    }
    setVisible(v) {
        if (v) {
            this.elm.style.visibility = "visible";
        } else {
            this.elm.style.visibility = "hidden";
        }
    }
    static divToWindow(div,wname) {
        let head = document.createElement("div");
        head.className = "windowHead";
        let hb = {"close":document.createElement("span")};
        hb.close.className = "windowMinimizeSpan";
        hb.close.innerHTML = "X";
        head.appendChild(hb.close);
        head.appendChild(document.createTextNode(" " + wname));
        div.insertBefore(head,div.firstChild);
        makeClosable(div,hb.close);
        
        return new FjWindow(div,wname,head,hb);
    }
}
