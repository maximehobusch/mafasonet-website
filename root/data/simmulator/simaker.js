const LOCAL_STORAGE_PRE_NAME = "FaBaeSimuMaker_";
const LOCAL_STORAGE_LIST_NAME = "LIST";
const LOCAL_STORAGE_RUN = "FaBaerSimuRUN";
const VAR_FIELD = "vars";
const LOOP_PRG_FIELD = "loopprg";
const START_PRG_FIELD = "startprg";
const END_PRG_FIELD = "endprg";
const DCTM_PRG_FIELD = "dctm";
const NLOOP_PRG_FIELD = "nloop";
const LIVE_DIAGR_FIELD = "ldia";
const END_DIAGR_FIELD = "adia";
const SIMU_LIST_SELECT = "sl";
const DEFAULT_LIVE_DIAO = {"n":"name","x":"x","y":"y","color":"#000000","xmin":-1,"xmax":1,"ymin":-1,"ymax":1};
const DEFAULT_END_DIAO = {"n":"name","x":"x","y":"y","color":"#000000"};
const DEFAULT_SIMU_JSON = "{\"loopprg\":\"\",\"startprg\":\"\",\"endprg\":\"\",\"livedia\":[],\"enddia\":[],\"dctm\":25,\"nloop\":1000}";
const URL_SIMMULATOR = "Simmulation.html";


var tmplist = [];
var lslist = [];
var simu;
onload = function() {
	loadWithJSON(DEFAULT_SIMU_JSON);
	loadJSON("templates/list.json",setlist);
	lslist = loadLocalStorageList();
	printSimuList();
}
function setlist(l) {
	tmplist = JSON.parse(l);
	printSimuList();
}
function loadJSON(pth,answerfunction) {
	var request = new XMLHttpRequest();
	request.open("GET",pth);
	request.overrideMimeType("application/json");
	request.send();
	request.addEventListener('load', function(event) {
		answerfunction(request.responseText);
	});
}
function loadWithJSON(s) {
	var o = JSON.parse(s);
	simu = new Sim();
	simu.changeLoopPrg(o.loopprg);
	simu.changeStartPrg(o.startprg);
	simu.changeEndPrg(o.endprg);
	simu.setLiveDias(o.livedia);
	simu.setEndDias(o.enddia);
	simu.setDctm(o.dctm);
	simu.setNloop(o.nloop);
}
function loadWithLadeauswahl(s) {
	var n = s.substring(1,s.length);
	if (s.charAt(0) == ":") {
		loadWithJSON(localStorage.getItem(LOCAL_STORAGE_PRE_NAME + n));
	} else {
		loadJSON("templates/" + n + ".json",loadWithJSON);
	}
}
function saveInLocalStorage(json) {
	n = prompt("Name der Simmulation");
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
function Sim(d) {
	var loopprg = "";
	var startprg = "";
	var endprg = "";
	var livedia = [];
	var enddia = [];
	var dctm = 10;
	var nloop = 1000;

	this.getLoopPrg = function () {return loopprg};
	this.changeLoopPrg = function (p) {loopprg = p; printLoopPrg(this)}
	this.getStartPrg = function () {return startprg};
	this.changeStartPrg = function (p) {startprg = p; printStartPrg(this)}
	this.getEndPrg = function () {return endprg};
	this.changeEndPrg = function (p) {endprg = p; printStartPrg(this)}
	this.getLiveDia = function () {return livedia};
	this.addLiveDia = function (d) {livedia.push(d); printLiveDiagram(this)};
	this.setLiveDias = function (d) {livedia = d; printLiveDiagram(this)};
	this.changeLiveDia = function (d,i) {livedia[i] = d; printLiveDiagram(this)};
	this.getEndDia = function () {return enddia};
	this.addEndDia = function (d) {enddia.push(d); printEndDiagram(this)};
	this.setEndDias = function (d) {enddia = d; printEndDiagram(this)};
	this.changeEndDia = function (d,i) {enddia[i] = d; printEndDiagram(this)};
	this.setDctm = function (v) {dctm = v*1; printDctm(this)}
	this.getDctm = function () {return dctm;}
	this.setNloop = function (v) {nloop = v*1; printNloop(this)}
	this.getNloop = function () {return nloop;}
	this.getSaJSON = function () {return JSON.stringify({loopprg,startprg,endprg,livedia,enddia,dctm,nloop})};
	this.getSiJSON = function() {
		var st = startprg + "\n";
		var lives = "";
		if (livedia.length > 0) lives = "clearLiveDiagram();\n";
		for (var i = 0; i < livedia.length; i++) {
			var ox = -(livedia[i].xmin*1+livedia[i].xmax*1)/2;
			var sx = 1.0/(-ox-livedia[i].xmin*1);
			ox = ox*sx;
			var oy = -(livedia[i].ymin*1+livedia[i].ymax*1)/2;
			var sy = 1.0/(-oy-livedia[i].ymin*1);
			oy = oy*sy;
			st = st + "setLiveGraph(\"" + livedia[i].n + "\",\"" + livedia[i].color + "\",8,new Skala(" + ox + "," + oy + "," + sx + "," + sy + ",true));\n";
			lives = lives + "drawWithLiveGraph(\"" + livedia[i].n + "\"," + livedia[i].x + "," + livedia[i].y + ");\n";
		}
		var strdVars = [];
		var adi1 = "var adia = new VMemoryDiagram(livediagr,vmemory);\n";
		var adi2 = "clearLiveDiagram();\n";
		for (var i = 0; i < enddia.length; i++) {
			var xses = stringToArray(enddia[i].x);
			var yses = stringToArray(enddia[i].y);
			var colors = stringToArray(enddia[i].color);
			strdVars = noDouples(arrayUnite(arrayUnite(strdVars,xses),yses));
			adi1 = adi1 + "var skala" + i + " = adia.createSkalaMulti(" + JSON.stringify(xses) + "," + JSON.stringify(yses) + ",true);\n";

			for (var j = 0; j < xses.length; j++) {
				for (var k = 0; k < yses.length; k++) {
					adi1 = adi1 + "adia.addGraph(new Graph(\"" + enddia[i].n + "_" + xses[j] + "-" + yses[k] + "\",\"" + colors[(j*yses.length+k)%colors.length] + "\",1,skala" + i + ",true));\n";
					adi2 = adi2 + "adia.drawRightOrder(\"" + enddia[i].n + "_" + xses[j] + "-" + yses[k] + "\",\"" + xses[j] + "\",\"" + yses[k] + "\");\n";
				}
			}

		}
		var en = endprg + "\nresetDiagr();\n" + adi1 + adi2;
		var lo = loopprg + "\n";
		for (var i = 0; i < strdVars.length; i++) {
			lo = lo + "storageValue(\"" + strdVars[i] + "\"," + strdVars[i] + ");\n";
		}
		lo = lo + lives;
		return JSON.stringify({"start":st,"loop":lo,"end":en,"dctm":dctm,"nloop":nloop});
	}
}

function arrayUnite(a1,a2) {
	var ret = a1.slice();
	for (let i = 0; i < a2.length; i++) {
		ret.push(a2[i]);
	}
	return ret;
}
function noDouples(arr) {
	var ret = [];
	for (let i = 0; i < arr.length; i++) {
		var f = false;
		for (var j = 0; j < i; j++) {
			if (arr[j] == arr[i]) {
				f = true;
				break;
			}
		}
		if (!f) ret.push(arr[i]);
	}
	return ret;
}
function stringToArray(s) {
	var ret = [];
	var i = -1;
	while (true) {
		var ia = i;
		i = s.indexOf(" ",i+1);
		if (i == -1) {
			ret.push(s.substring(ia+1,s.length));
			return ret;
		}
		ret.push(s.substring(ia+1,i));
	}
}
function Var(n,v,storageN) {
	this.nam = n;
	this.val = v;
}
function printSimuList() {
	var s = "";
	for (var i = 0; i < lslist.length; i++) {
		s = s + "<option value=\":" + lslist[i] + "\">" + lslist[i] + " (Browser Storage)</option>";
	}
	for (var i = 0; i < tmplist.length; i++) {
		s = s + "<option value=\"%" + tmplist[i] + "\">" + tmplist[i] + " (Vorlage)</option>";
	}
	document.getElementById(SIMU_LIST_SELECT).innerHTML = s;
}
function printLoopPrg(si) {
	document.getElementById(LOOP_PRG_FIELD).value = si.getLoopPrg();
}
function printStartPrg(si) {
	document.getElementById(START_PRG_FIELD).value = si.getStartPrg();
}
function printEndPrg(si) {
	document.getElementById(END_PRG_FIELD).value = si.getStartPrg();
}
function printDctm(si) {
	document.getElementById(DCTM_PRG_FIELD).value = si.getDctm();
}
function printNloop(si) {
	document.getElementById(NLOOP_PRG_FIELD).value = si.getNloop();
}
function printLiveDiagram(si) {
	var lives = si.getLiveDia();
	var s = "<table border=\"1\"><tbody><tr><td><b>Name</b></td><td><b>x</b></td><td><b>y</b></td><td><b>Farbe</b></td><td><b>xmin</b></td><td><b>xmax</b></td><td><b>ymin</b></td><td><b>ymax</b></td></tr>";
	for (var i = 0; i < lives.length; i++) {
		s = s + "<tr>";
		s = s + td(lives[i].n,i,"n","Name");
		s = s + td(lives[i].x,i,"x","x-wert (Variablenname oder Zahl)");
		s = s + td(lives[i].y,i,"y","y-wert (Variablenname oder Zahl)");
		s = s + td(lives[i].color,i,"color","Farbe (z.b. #00ff40 oder rgb(0,255,64)");
		s = s + td(lives[i].xmin,i,"xmin","x-min (welche x-koordinate der linke Bildschirmrand hat)");
		s = s + td(lives[i].xmax,i,"xmax","x-max (welche x-koordinate der rechte Bildschirmrand hat)");
		s = s + td(lives[i].ymin,i,"ymin","y-min (welche y-koordinate der untere Bildschirmrand hat)");
		s = s + td(lives[i].ymax,i,"ymax","y-max (welche y-koordinate der obere Bildschirmrand hat)");
		s = s + "</tr>";
	}
	document.getElementById(LIVE_DIAGR_FIELD).innerHTML = s + "<tr><td onclick=\"simu.addLiveDia(JSON.parse(JSON.stringify(DEFAULT_LIVE_DIAO)));\">+</td></tbody></table>";
	function td(val,n,onclch,onclchntit) {
		return "<td onclick=\"var l = simu.getLiveDia()[" + n + "]; var prmt=prompt('" + onclchntit + "','" + val + "'); if (prmt != null) l." + onclch + "=prmt; simu.changeLiveDia(l," + n +");\">" + val + "</td>";
	}
}
function printEndDiagram(si) {
	var ends = si.getEndDia();
	var s = "<table border=\"1\"><tbody><tr><td><b>Name</b></td><td><b>x</b></td><td><b>y</b></td><td><b>Farbe</b></td></tr>";
	for (var i = 0; i < ends.length; i++) {
		s = s + "<tr>";
		s = s + td(ends[i].n,i,"n","Name");
		s = s + td(ends[i].x,i,"x","x-werte (Variablenname. Auch mehere möglich getrennt durch leerzeichen)");
		s = s + td(ends[i].y,i,"y","y-werte (Variablenname. Auch mehere möglich getrennt durch leerzeichen)");
		s = s + td(ends[i].color,i,"color","Farbe (z.b. #00ff40 oder rgb(0,255,64) , Auch mehere möglich getrennt durch leerzeichen)");
		s = s + "</tr>";
	}
	document.getElementById(END_DIAGR_FIELD).innerHTML = s + "<tr><td onclick=\"simu.addEndDia(JSON.parse(JSON.stringify((DEFAULT_END_DIAO))));\">+</td></tbody></table>";
	function td(val,n,onclch,onclchntit) {
		return "<td onclick=\"var l = simu.getEndDia()[" + n + "]; var prmt=prompt('" + onclchntit + "','" + val + "'); if (prmt != null) l." + onclch + "=prmt; simu.changeEndDia(l," + n +");\">" + val + "</td>";
	}
}


function createHTMLInputText(n,val,change,classs,size) {
	return createHTMLInput("text",n,val,change,classs,size);
}
function createHTMLInput(ty,n,val,change,classs,size) {
	return "<input type=\"" + ty + "\" value=\"" + val + "\" onchange=\"" + change + "\" class=\"" + classs + "\" size=\"" + size + "\">";
}
function createHTMLInputCheckbox(n,val,change,classs,size) {
	return "<input type=\"checkbox\" checked=\"" + val + "\" onchange=\"" + change + "\" class=\"" + classs + "\" size=\"" + size + "\">";
}






