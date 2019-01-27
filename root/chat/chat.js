var showGruppe = undefined;
var chatgruppenfeldAlt = "";
var chatvalueAlt = "";
var cvscrollBottom = true;
var meMeta = "";
var groupinfoAlt = [];
var numberMessagesReaded = [];
var logInAlt = undefined;
var AUF_EINMAL_LADEN = 10;
var WAIT_BEVORE_START = 2000;
var allContentFields = ["neuegruppe","newuser","signin","chatgruppen","gruppenchat","pwae","pwaein","pwaeoffin","newgroupoff","editprofiloff","profil","newuseroff","signinoff","pwaeoff"];
onload = function() {
	setUpStyleLoader();
	window.setTimeout(onloaded,WAIT_BEVORE_START);
//	onloaded();
}
function onloaded() {
	document.getElementById("msg").onkeydown = function(e) {
		if (e.keyCode == 13) {sendMessage(showGruppe,this.value);this.value="";}
	}
	loginTrialResult = function(result,information) {
		if (result) {
//			fjangsalert("Login Successful");
		} else {
			errpwd("pwd1");
			fjangsalert("Error: " + information);
		}
	}
	alertfunction = fjangsalert;
	window.setInterval(draw,250);
	setVisibleOf("loading",false);
	setVisibleOf("all",true);
	setVisibleOfAndOther("signinoff",true,false);
	setVisibleOf("newuseroff",true);
	setVisibleOf("pwaeoff",true);	setVisibleOf("signedInMenubar",false);	Notification.requestPermission();
//	new Notification("Mafasonet Chat", {"icon":"/img/MafasonetChat.png","body":"Neue Nachrichten werden ab sofort hier angezeigt"});
}
function draw() {
	if (connectedUser != undefined) if (JSON.stringify(meMeta) != JSON.stringify(getUserMetaById(connectedUser))) {
		meMeta = getUserMetaById(connectedUser);
		refreshProfileFields(meMeta);
	}
	if (logInAlt != logIn && logIn == true) {
	setVisibleOf("unsignedInMenubar",false);	setVisibleOf("signedInMenubar",true);
		setVisibleOfAndOther("chatgruppen",true,false);
		setVisibleOf("signedInMenubar",true);
		setVisibleOf("newgroupoff",true);
		setVisibleOf("editprofiloff",true);
		setVisibleOf("pwaeoffin",true);
	}
	logInAlt = logIn;
	printGruppenAuswahl();
	printChat();
	checkBing();
}
function printGruppenAuswahl() {
	if (grouplist == undefined) return;
	var s = "";
	for (var a = 0; a < grouplist.length; a++) {
		s = s + "<p><input type=\"button\" class=\"groupbutton\" value=\"" + gruppenText(grouplist[a]) + "\" onclick=\"gruppeAusaehlen('" + grouplist[a] + "');setVisibleOf('nmlcht',true);setVisibleOf('unmlcht',false)\"></p>";
	}

	if (chatgruppenfeldAlt != s) document.getElementById("chatgruppenfield").innerHTML = s;
	chatgruppenfeldAlt = s;
}

function autoscroll() {
	if (cvscrollBottom) {
		var cv = document.getElementById("chatfield");
		cv.scrollTop = cv.scrollHeight - cv.clientHeight;
	}
}
function checkScrollBottom() {
	var cv = document.getElementById("chatfield");
	cvscrollBottom = Math.abs(cv.scrollTop - (cv.scrollHeight - cv.clientHeight)) < 25;
}

function printChat() {
	document.getElementById("gruppenname").innerHTML = gruppenHTMLText(showGruppe);
	if (showGruppe == null) return;
	if (messageHeads[showGruppe] == null) return;
	checkScrollBottom();
	var s = "";
	var a = 0;
	for (a = 0; a < messageHeads[showGruppe].length; a++) {
		if (messageHeads[showGruppe][a] != undefined) break;
	}
	if (a != 0) s = s + moreDownloadDiv(Math.max(0,a-AUF_EINMAL_LADEN),Math.min(a,AUF_EINMAL_LADEN),a);

	for (undefined; a < messageHeads[showGruppe].length; a++) {
		s = s + nachrichtHTML(messageHeads[showGruppe][a],a) + "";
	}
	if (chatvalueAlt != s) {
		document.getElementById("chatvalued").innerHTML = s;
		autoscroll();
	}
	chatvalueAlt = s;
	var inf = getGroupInfoById(showGruppe);
	if (inf != undefined) {
		numberMessagesReaded[showGruppe] = inf.messages;
	}
}
function nachrichtHTML(m,num) {
	if (m == undefined) return "<div class=\"messagefieldMaster\" onclick=\"messageheads(showGruppe,1," + num + ");\">Ungeladener Nachrichtenkopf<br>Klicken um manuel herunterzuladen</div>"
	if (m.status != "ok") return "<div class=\"messagefieldMaster\">Fehlerhafte Nachricht:<br>" + m.status + "</div>";
	var classs = "messagefieldOther";
	if (m.sender == connectedUser) classs = "messagefieldMe";
	if (m.sender == "mafasonetchatmaster") classs = "messagefieldMaster";
	return "<div class=\"" + classs + "\"><span class=\"sendertext\">" + senderHTMLText(m.sender) + "</span><br>" + getMessageValueHTML(m) + "<br><span class=\"datetext\">" + millisToDate(m.time) + "</span></div>";
}
function getMessageValueHTML(m) {
	var v = getMessageValueById(m.id);
	if (v == undefined) return "Inhalt der Nachricht " + m.id + " nicht geladen<br><span class=\"klickbartext\" onclick=\"getmessagevalue('" + m.id + "')\">Hier klicken um manuell herunterzuladen</span>";
	return v;
}
function moreDownloadDiv(st,num,gesamtUngeladen) {
	return "<div class=\"messagefieldMaster\" onclick=\"messageheads(showGruppe," + num + "," + st + ");\">" + gesamtUngeladen + " ungeladene Nachrichten<br>Klicken um " + num + " weitere Nachrichtenköpfe zu laden</div>";
}
function senderHTMLText(senderId) {
	var u = getUserMetaById(senderId);
	if (u == undefined) return "uid: " + senderId;
	return "<span title=\"uid: " + senderId + "\" onclick=\"fjangsalert('uid: " + senderId + "');\">" + u.n + "</span>";
}
function gruppenText(gruppenId) { 

var gm = getGroupMetaById(gruppenId);
	var gi = getGroupInfoById(gruppenId);
	var s = "gid: " + gruppenId;
	if (gm != undefined) s = gm.n + " (" + s + ")";
	if (gi != undefined) {
		s = s + " " + gi.members.length + " Gruppenmitglied(er)";
		if (gi.messages != undefined) if (gi.messages != numberMessagesReaded[gruppenId]) {
			if (numberMessagesReaded[gruppenId] == undefined) {
				s = "[" + gi.messages + "] " + s;
			} else {
				s = "[" + (gi.messages-numberMessagesReaded[gruppenId]) + "] " + s;
			}
		}
	}
	return s;
}
function gruppenHTMLText(gruppenId) { 
var zurck = "<input type=\"button\" class=\"Buttonn\" style=\"border-radius:100px; padding:3px\" value=\"⇦&nbsp;\" onclick=\"setVisibleOf('chatgruppen',true);setVisibleOf('gruppenchat',false)\">&nbsp;&nbsp;"
	var gm = getGroupMetaById(gruppenId);
	var gi = getGroupInfoById(gruppenId);
	var s = "gid: " + gruppenId;
	if (gm != undefined) {
		s = zurck + gm.n + "(" + s + ")";
	} else {
		s = s + zurck;
	}
	if (gi != undefined) s = s + "  Gruppenmitglied(er): " + gi.members + "; " + gi.messages + " Nachrichten</h3>";
	return s;
}
function millisToDate(millis) {
	return new Date(millis).toString();
}
function gruppeAusaehlen(grid) {
	setVisibleOfAndOther('gruppenchat',true,false);

setVisibleOf("signedInMenubar",true);
setVisibleOf("newgroupoff",true);
setVisibleOf("editprofiloff",true);
setVisibleOf("pwaeoffin",true);
showGruppe = grid;	document.getElementById("gruppenname").innerHTML = gruppenHTMLText(showGruppe);
	setWathingGroup(grid);
}
function hinz(uid) {
	addgroupmember(showGruppe,uid);
}
function entf(uid) {
	removegroupmember(showGruppe,uid);
}
function hideContent(contentid) {
	setVisibleOf(contentid,false);
}
function showContent(contentid) {
	setVisibleOf(contentid,true);
}
function setVisibleOf(contentid,v) {
	if (v) {
		document.getElementById(contentid).style.display = "inline";
	} else {
		document.getElementById(contentid).style.display = "none";
	}
}
function setVisibleOfAndOther(contentid,vc,vo) {
	setVisibleOf(contentid,true);
	for (var i = 0; i < allContentFields.length; i++) {
		if (contentid != allContentFields[i]) setVisibleOf(allContentFields[i],vo);
	}
}
function fjangsalert(s) {
	document.getElementById("fjangsalertfield").innerHTML = s;
	window.setTimeout(function() {document.getElementById('fjangsalertclosebutton').focus()},10);
	showContent("fjangsalert");
}
function refreshProfileFields(m) {
	if (m == undefined) {
//		hideContent("profil");
	} else {
//		showContent("profil");
		document.profil.namen.value = m.n;
	}
}

function bing(ng,nn) {
	document.getElementById("msgsound").currentTime = 0;
	document.getElementById("msgsound").play();
	window.navigator.vibrate([500,250,500,250,250,125,250,125,250]);
	var s = "Gruppen:";
	for (var a = 0; a < ng.length; a++) { 
		s = s + "\n" + ng[a];
	}
	if (ng.length != 0) notify(ng.length + " Neue Gruppe(n)", {"icon":"/img/MafasonetChat.png","body":s},function() {setVisibleOfAndOther('chatgruppen',true,false); showGruppe = undefined;});
	for (var a = 0; a < grouplist.length; a++) {
		if (nn[grouplist[a]] != 0 && nn[grouplist[a]] != undefined) notify(nn[grouplist[a]] + " Neue Nachricht(en)", {"icon":"/img/MafasonetChat.png","body":"In Gruppe gid:" + grouplist[a]},function () {gruppeAusaehlen(grouplist[a])})
	}

}
function notify(t,o,oncl) {
	var n = new Notification(t,o);
	n.onclick = oncl;
}
function errpwd(id) {
	let oldclass = document.getElementById(id).className;
	document.getElementById(id).className ='pwderr';
	window.setTimeout(function() {document.getElementById(id).className = oldclass},8000);
}
function checkBing() {
	var ng = [];
	var nn = {};
	var bi = false;
	if (grouplist == undefined) return;
	for (var a = 0; a < grouplist.length; a++) {
		nn[grouplist[a]] = 0;
		var inf = getGroupInfoById(grouplist[a]);
		if (inf == undefined) continue;
		if (groupinfoAlt[grouplist[a]] == undefined) {
			ng[ng.length] = grouplist[a];
			bi = true;
		} else if (groupinfoAlt[grouplist[a]].messages != inf.messages) {
			nn[grouplist[a]]++;
			bi = true;
		}
		if (bi) groupinfoAlt[grouplist[a]] = inf;

	}
	if (bi) bing(ng,nn);
}
let showStyleconfigfieldCategorie;
function showStyleconfigfield(categorie) {
	showStyleconfigfieldCategorie = categorie;
	document.getElementById("styleconfigcat").innerHTML = "Aussehen<br>Kategorie: " + categorie;
	let arr = getImplementedStyles(categorie);
	let s = "";
	for (let i = 0; i < arr.length; i++) {
		s = s + "<option>" + arr[i] + "</option>";
	}
	document.getElementById("styleconfigselect").innerHTML = s;
	showContent("styleconfig");
}
let changeStyleminibuttonState = false;
let styleminibuttonClosedInnerHTML;
function changeStyleminibutton() {
	changeStyleminibuttonState = !changeStyleminibuttonState;
	let e = document.getElementById("styleminibutton")
	if (changeStyleminibuttonState) {
		styleminibuttonClosedInnerHTML = e.innerHTML;
		let s = "Style Einstellungen";
		let ctg = getImplementedStyleCategories();
		for (let i = 0; i < ctg.length; i++) {
			s = s + "<br><input type=\"button\" class=\"stylecatbutton\" value=\"" + ctg[i] + "\" onclick=\"showStyleconfigfield(this.value);\">"
		}
		e.innerHTML = s;
		e.style.width="80%";
		e.style.height="80%";
	} else {
		e.innerHTML = styleminibuttonClosedInnerHTML;
		e.style.width="40px";
		e.style.height="40px";
	}
}
