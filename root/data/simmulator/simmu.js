const MAX_CONS_LENGTH = 1000;
const LOCAL_STORAGE_PRE_NAME = "FaBaeSimu_";
const LOCAL_STORAGE_LIST_NAME = "LIST";
const LOCAL_STORAGE_RUN = "FaBaerSimuRUN";
const MIN_SKALE_DOT_DISTANCE_Y = 20;
const MIN_SKALE_DOT_DISTANCE_X = 35;
const SKALE_DOT_BASE = 10;
const SKALE_DOT_ROUND = 1;
var Simu;
var aktuSimu;
var aktuSimuData;
var livediagr;
var vmemory;
onload = function () {
	printLocalStorageList();
	var ruun = localStorage.getItem(LOCAL_STORAGE_RUN);
	if (ruun != undefined || ruun != "") {
		var o = JSON.parse(ruun);
		document.f.nam.value = "???";
		document.f.sta.value = o.start;
		document.f.prg.value = o.loop;
		document.f.diapg.value = o.end;
		document.f.milis.value = o.dctm;
		document.f.anz.value = o.nloop;
		localStorage.setItem(LOCAL_STORAGE_RUN,"");
		setSimu(o.start,o.loop,o.end);
		startSimu(o.dctm*1,o.nloop*1);
	}
}

function setSimu(startProgram, loopProgram, diagrProgram) {
	var prgTxt = startProgram + "\n" + "this.loop = function() {" + loopProgram + "};\nthis.vmemoDiagr = function() {" + diagrProgram + "}";


	Simu = new Function(prgTxt);
}
function getSimuSaveJSON(startProgram, loopProgram, diagrProgram, deltaCalcTimeMillis, numberLoop) {
	return JSON.stringify({"start":startProgram,"loop":loopProgram,"end":diagrProgram,"dctm":deltaCalcTimeMillis,"nloop":numberLoop});
}
function saveInLocalStorage(n ,json) {
	if (n == "") {
		alert("Bitte Name eintragen!");
		return;
	}
	localStorage.setItem(LOCAL_STORAGE_PRE_NAME + n, json);
	var l = loadLocalStorageList();
	var da = false;
	for (var a = 0; a < l.length; a++) {
		if (l[a] == n) {
			da = true;
			break;
		}
	}
	if (!da) l[l.length] = n;
	localStorage.setItem(LOCAL_STORAGE_PRE_NAME + LOCAL_STORAGE_LIST_NAME,JSON.stringify(l));
}
function deleteProgrammLocalStorage(n) {
	if (n == "" || n == undefined) return;
	localStorage.setItem(LOCAL_STORAGE_PRE_NAME + n,"");
	var l = loadLocalStorageList();
	var ln = [];
	for (var a = 0; a < l.length; a++) {
		if (l[a] != n && l[a] != undefined) ln[ln.length] = l[a];
	}
	localStorage.setItem(LOCAL_STORAGE_PRE_NAME + LOCAL_STORAGE_LIST_NAME,JSON.stringify(ln));
}
function loadLocalStorageList() {
	var s = localStorage.getItem(LOCAL_STORAGE_PRE_NAME + LOCAL_STORAGE_LIST_NAME);
	if (s == undefined || s == "") return [];
	return JSON.parse(s);
}
function printLocalStorageList() {
	var s = "<select name=\"loadStoName\" class=\"knoppNeutral\">";
	var l = loadLocalStorageList();
	for (var a = 0; a < l.length; a++) {
		s = s + "<option>" + l[a] + "</option>";
	}
	document.getElementById("selectField").innerHTML = s + "</select>";
}
function consoleLog(s) {
	var cns = document.getElementById("cons");
	cns.innerHTML = cns.innerHTML + "<br>" + s;
	if (cns.innerHTML.length > MAX_CONS_LENGTH) cns.innerHTML = "..." + cns.innerHTML.slice(cns.innerHTML.length - MAX_CONS_LENGTH,cns.innerHTML.length);
}
function consoleSet(s) {
	document.getElementById("cons").innerHTML = s;
}
function startSimu(deltaCalcTimeMillis, numberLoop) {
	resetDiagr();
	resetVmemo();
	if (numberLoop == Infinity && deltaCalcTimeMillis <= 0) deltaCalcTimeMillis = 1;
	aktuSimuData = {"dctm":deltaCalcTimeMillis, "nloop":numberLoop};
	try {
		aktuSimu = new Simu();
		window.setTimeout(simuLoop,100);
	} catch (e) {
		consoleLog(e);
	}
}
function cancelSimu() {
	if (aktuSimuData != undefined) aktuSimuData.nloop = -1;
}

function simuLoop() {
	if (aktuSimuData.nloop <= 0) {
		try {
			finalSimu();
		} catch (e) {
			consoleLog(e);
		}
		return;
	}
	vmemory[vmemory.length] = new ValueMemory();
	try {
		aktuSimu.loop();
	} catch (e) {
		consoleLog(e);
	}
	aktuSimuData.nloop--;
	if (aktuSimuData.dctm == 0) {
		simuLoop();
	} else {
		window.setTimeout(simuLoop,aktuSimuData.dctm);
	}
}
function finalSimu() {
//	cns = getVmemoryHTML();
	aktuSimu.vmemoDiagr();
}
function resetDiagr() {
	var canv = document.getElementById("diagrcanvas");
	var ct = canv.getContext("2d");
	livediagr = new Diagram(canv.width*1,canv.height*1,ct);
	ct.clearRect(0,0,canv.width*1,canv.height*1);
}
function resetVmemo() {
	vmemory = [];
}
function Diagram(w,h,c) {
	var ctx = c;
	var wi = w;
	var hw = w/2;
	var he = h;
	var hh = h/2;
	var siz = Math.min(wi, he)/2.0;

	var graphs = [];
	var graphLastPs = [];
	this.addGraph = function(g) {
		graphs[graphs.length] = g;
		graphLastPs[graphs.length] = undefined;
	}
	function getGraphIndexByName(n) {
		for (var a = 0; a < graphs.length; a++) {
			if (graphs[a].getName() == n) return a;
		}
		return -1;
	}
	this.drawSkala = function(ska) {
		drawSkala(sk);
	}
	function drawSkala(sk) {
		ctx.fillStyle = "#555555";
		ctx.lineWidth = 2;

		var bx = Math.min(wi-3,Math.max(2,toBX(sk.getX(0))));
		ctx.fillRect(bx-1,0,2,he);

		var xUnitB = Math.abs(toBX(sk.getX(0))-toBX(sk.getX(1)));
		var xe = Math.ceil(logab(SKALE_DOT_BASE,MIN_SKALE_DOT_DISTANCE_X/xUnitB)/SKALE_DOT_ROUND)*SKALE_DOT_ROUND;
		var xd = Math.pow(SKALE_DOT_BASE,xe);
		var xoffs = Math.floor(sk.backwardX(backX(0))/xd);
		var xanz = Math.ceil(wi/(xd*xUnitB))+1;

		var by = Math.min(he-3,Math.max(2,toBY(sk.getY(0))));
		ctx.fillRect(0,by-1,wi,2);

		var yUnitB = Math.abs(toBY(sk.getY(0))-toBY(sk.getY(1)));
		var ye = Math.ceil(logab(SKALE_DOT_BASE,MIN_SKALE_DOT_DISTANCE_Y/yUnitB)/SKALE_DOT_ROUND)*SKALE_DOT_ROUND;
		var yd = Math.pow(SKALE_DOT_BASE,ye);
		var yoffs = Math.ceil(sk.backwardY(backY(he))/yd);
		var yanz = Math.ceil(he/(yd*yUnitB))+1;
		ctx.font = "18px sans";
		ctx.textAlign = "center";
		for (var a = 0; a < xanz; a++) {
			ctx.fillStyle = "#555555";
			ctx.fillRect(toBX(sk.getX((xoffs+a)*xd))-1,by,2,6);
			ctx.fillStyle = "#222222";
			ctx.fillText(Number.parseFloat((xoffs+a)*xd).toPrecision(4)*1,toBX(sk.getX((xoffs+a)*xd)),by-1);
		}
		ctx.textAlign = "left";
		for (var a = 0; a < yanz; a++) {
			ctx.fillStyle = "#555555";
			ctx.fillRect(bx,toBY(sk.getY((yoffs+a)*yd))-1,6,2);
			ctx.fillStyle = "#222222";
			ctx.fillText(" " + Number.parseFloat((yoffs+a)*yd).toPrecision(4)*1,bx,toBY(sk.getY((yoffs+a)*yd)));
		}

	}
	this.draw = function(n,x,y) {
		var inx = getGraphIndexByName(n);
		if (inx == -1) return;
		var bx = toBX(graphs[inx].getX(x));
		var by = toBY(graphs[inx].getY(y));
		graphs[inx].setCanvasOptions(ctx);
		if (!graphs[inx].getConnected() || graphLastPs[inx] == undefined) {
			ctx.beginPath();
			ctx.arc(bx,by,graphs[inx].getSize()/2.0,0,Math.PI*2,false);
			ctx.closePath();
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.moveTo(graphLastPs[inx].x,graphLastPs[inx].y);
			ctx.lineTo(bx,by);
			ctx.closePath();
			ctx.stroke();
		}
		graphLastPs[inx] = {"x":bx,"y":by};
	}
	this.clearCanvas = function() {
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0,wi,he);
		for (var i = 0; i < graphs.length; i++) {
			drawSkala(graphs[i].getSkala());
		}
	}
	function toBX(x) {
		return x*siz + hw;
	}
	function toBY(y) {
		return -y*siz + hh;
	}
	function backX(bx) {
		return (bx-hw)/siz;
	}
	function backY(by) {
		return -(by-hh)/siz;
	}

	this.getWidth = function() {return wi;}
	this.getHeight = function() {return he;}
	this.getUnit = function() {return siz;}
	this.clearCanvas();
}
function Graph(na,col,si,sk,con,dlo) {
	var namen = na;
	var color = col;
	var size = si;
	var ska = sk;//skala
	var connected = con;
	this.getX = function(x) {
		return ska.getX(x);
	}
	this.getY = function(y) {
		return ska.getY(y);
	}
	this.setCanvasOptions = function(c) {
		c.strokeStyle = color;
		c.fillStyle = color;
		c.lineWidth = size;
		c.lineCap = "round";
		c.lineJoin = "round";
	}
	this.getConnected = function() {
		return connected;
	}
	this.getSize = function() {
		return size;
	}
	this.getName = function() {
		return namen;
	}
	this.getSkala = function() {
		return ska;
	}
}
function Skala(oX,oY,sX,sY) {
	var offX = oX;
	var offY = oY;
	var skaleX = sX;
	var skaleY = sY;
	this.getX = function(x) {
		return x*skaleX + offX;
	}
	this.getY = function(y) {
		return y*skaleY + offY;
	}
	this.backwardX = function(xb) {
		return (xb-offX)/skaleX;
	}
	this.backwardY = function(yb) {
		return (yb-offY)/skaleY;
	}
	this.getOffX = function() {return offX};
	this.getOffY = function() {return offY};
	this.getskaleX = function() {return skaleX};
	this.getskaleY = function() {return skaleY};
}
function ValueMemory() {
	var keys = [];
	var values = [];
	function getIndexByKey(key) {
		for (var a = 0; a < keys.length; a++) {
			if (keys[a] == key) return a;
		}
		return -1;
	}
	this.set = function(key,value) {
		var inx = getIndexByKey(key);
		if (inx == -1) {
			keys[keys.length] = key;
			values[values.length] = value;
		} else {
			values[inx] = value;
		}
	}
	this.get = function(key) {
		var inx = getIndexByKey(key);
		if (inx == -1) return undefined;
		return values[inx];
	}
	this.getKeys = function() {
		return keys;
	}
}
function VMemoryDiagram(diagr,vmeArr) {
	var di = diagr;
	var vm = vmeArr;
	this.drawRightOrder = function(n,keyX,keyY) {
		for (var a = 0; a < vm.length; a++) {
			var x = vm[a].get(keyX);
			var y = vm[a].get(keyY);
			if (x == undefined || y == undefined) continue;
			di.draw(n,x,y);
		}
	}
	this.drawXSorted = function(n,keyX,keyY) {
		var xvls = [];
		for (var a = 0; a < vm.length; a++) {
			xvls[a] = vm[a].get(keyX);
		}
		var sinx = sortArrayGetInx(xvls);
		for (var a = 0; a < sinx.length; a++) {
			var y = vm[sinx[a]].get(keyY);
			if (y == undefined || xvls[sinx[a]] == undefined) continue;
			di.draw(n,xvls[sinx[a]],y);
		}
	}
	this.addGraph = function(g) {
		di.addGraph(g);
	}
	this.createSkalaMulti = function(keysX,keysY,asym) {
		var minX = Infinity;
		var minY = Infinity;
		var maxX = -Infinity;
		var maxY = -Infinity;
		for (var b = 0; b < keysX.length; b++) {
			for (var a = 0; a < vm.length; a++) {
				var x = vm[a].get(keysX[b]);
				if (x == undefined) continue;
				minX = Math.min(minX,x);
				maxX = Math.max(maxX,x);
			}
		}
		for (var b = 0; b < keysY.length; b++) {
			for (var a = 0; a < vm.length; a++) {
				var y = vm[a].get(keysY[b]);
				if (y == undefined) continue;
				minY = Math.min(minY,y);
				maxY = Math.max(maxY,y);
			}
		}
		var oX = -(minX + maxX)/2;
		var oY = -(minY + maxY)/2;
		var sX;
		var sY;
		if (asym) {
			sX = di.getWidth()/di.getUnit()*0.49/(-oX-minX);
			sY = di.getHeight()/di.getUnit()*0.49/(-oY-minY);
		} else {
			sX = Math.min(0.98/(-oX-minX),0.98/(-oY-minY));
			sY = sX;
		}
		oX = oX*sX;
		oY = oY*sY;
		return new Skala(oX,oY,sX,sY);
	}
	this.createSkala = function(keyX,keyY,asym) {
		return this.createSkalaMulti([keyX],[keyY],asym);
	}

}
function sortArrayGetInx(arr) {
	var sd = [];
	for (var a = 0; a < arr.length; a++) {
		sd[a] = false;
	}
	var ret = [];
	for (var a = 0; a < arr.length; a++) {
		var mi = 0;
		for (var b = 1; b < arr.length; b++) {
			if ((arr[b] < arr[mi] && !sd[b]) || sd[mi]) mi = b;
		}
		ret[a] = mi;
		sd[mi] = true;
	}
	return ret;
}
function getVmemoryHTML() {
	var keys = [];
	for (var a = 0; a < vmemory.length; a++) {
		var k = vmemory[a].getKeys();
		for (var b = 0; b < k.length; b++) {
			var err = false;
			for (var c = 0; c < keys.length; c++) {
				if (keys[c] == k[b]) {
					err = true;
					break;
				}
			}
			if (!err) keys[keys.length] = k[b];
		}
	}
	var s = "<table> <tr>";
	for (var b = 0; b < keys.length; b++) {
		s = s + "<td><b>" + keys[b] + "</b></td>";
	}
	s = s + "</tr>";
	for (var a = 0; a < vmemory.length; a++) {
		s = s + "<tr>";
		for (var b = 0; b < keys.length; b++) {
			s = s + "<td>" + vmemory[a].get(keys[b]) + "</td>";
		}
		s = s + "</tr>";
	}
	return s + "</talbe>";
}
function logab(a,b) {//a: base
	return Math.log(b)/Math.log(a);
}

// User functions

//+ new Skala(oX,oY,sX,sY);

function setLiveGraph(na,col,si,sk,con) {//name, color, size, skala, connected
	livediagr.addGraph(new Graph(na,col,si,sk,con));
}
function drawWithLiveGraph(na,x,y) {
	livediagr.draw(na,x,y);
}
function clearLiveDiagram() {
	livediagr.clearCanvas();
}

function storageValue(key,value) {
	vmemory[vmemory.length-1].set(key,value);
}

