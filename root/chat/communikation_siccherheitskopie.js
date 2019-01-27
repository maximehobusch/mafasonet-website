var AUTO_VALUE_LOAD = true;
var AUTO_GRUOPMETA_AND_INFO_LOAD = true;

var tsadasd = [];
tsadasd[30] = "hauu";

var AUTO_REFRESH = true;
var GROUP_REFRESH_RATE = 2500;
var MESAGES_REFRESH_RATE = 1000;
var USER_REFRESH_RATE = 10000;

var mowmanyMessages = 20;
var moffset = 0;

var connectionId = undefined;
var connectedUser = undefined;
var logIn = false;
var grouplist = undefined;
var messageHeads = [];
var messageValues = {};

var groupmeta = {};
var groupinfo = {};
var usermeta = {};

var grfinter;
var mrdinter;
var refreshOn = false;

var loginTrialResult = function(result,information) {
	if (result) {
		alert("Login Successful");
	} else {
		alert("Error: " + information);
	}
}
var alertfunction = function(s) {
	alert(s);
}

function setChatVisibleArea(grid,numberMsg,offset) {
	wathingGroup = grid;
	mowmanyMessages = numberMsg;
	moffset = offset;
}

function startAutoRefresh() {
	if (refreshOn) return;
	grfinter = window.setInterval(groupRefresh,GROUP_REFRESH_RATE);
	mrfinter = window.setInterval(messageRefresh,MESAGES_REFRESH_RATE);
	urfinter = window.setInterval(autousermetaload,USER_REFRESH_RATE);

	refreshOn = true;
}
function stopAutoRefresh() {
	if (!refreshOn) return;
	window.clearInterval(grfinter);
	window.clearInterval(mrfinter);
	refreshOn = false;
}


var wathingGroup = undefined;
function setWathingGroup(gid) {
	wathingGroup = gid;
}
function groupRefresh() {
	getgrouplist();
}
function messageRefresh() {//loads the last <mowmanyMessages> messageheads of wathingGroup if unloaded
	if (wathingGroup == undefined) return;
	var inf = getGroupInfoById(wathingGroup);
	if (inf == undefined) return;
	var offs = inf.messages;
	if (messageHeads[wathingGroup] == undefined) messageHeads[wathingGroup] = [];
	for (var i = Math.max(0,inf.messages-mowmanyMessages); i < inf.messages; i++) {
		if (messageHeads[wathingGroup][i] == undefined) {
			offs = i;
			break;
		}
	}
	if (offs == inf.messages) return;
	messageheads(wathingGroup,inf.messages-offs,offs,false);

}
function sendRq(url,answerfunction) {
//	alert(url);
	var request = new XMLHttpRequest();
	request.open("GET",url);
	request.addEventListener('load', function(event) {
//			alert(request.responseText);
			answerfunction(request.responseText);
	});
	request.send();
}
function sendChatReq(action,paraKey,paraVal,answerfunction) {
	var s = "/chat_communication?action=" + encodeURI(action);
	for (var a = 0; a < paraKey.length; a++) {
		s = s + "&" + encodeURI(paraKey[a]) + "=" + encodeURI(paraVal[a]);
	}
	sendRq(s,answerfunction);
}


function usernew(uid,pw) {
	sendChatReq("newuser",["uid","pw"],[uid,pw],alertfunction);
}
function setpwd(uid,pw,pwnew) {
	sendChatReq("setpwd",["uid","pw","pwnew"],[uid,pw,pwnew],alertfunction);
}
function signin(uid,pw) {
	sendChatReq("signin",["uid","pw"],[uid,pw],setCid);
	connectedUser = uid;
}
function checkcid() {
	sendChatReq("checkcid",["cid"],[connectionId],function(m) {if (m == "ok") {startAutoRefresh(); logIn=true;} else {stopAutoRefresh(); logIn = false;}; loginTrialResult(m == "ok",m)});
}
function getgrouplist() {
	sendChatReq("getgrouplist",["cid"],[connectionId],putGrouplist);
}
function groupnew(gid) {
	sendChatReq("newgroup",["cid","gid"],[connectionId,gid],alertfunction);
}
function messageheads(gid,howmany,offset) {
	sendChatReq("getmessageheads",["cid","gid","howmany","offset","frombehind"],[connectionId,gid,howmany,offset,false],function(msjson) {putMessages(msjson,gid,offset)});
}
function sendMessage(gid,value) {
	sendChatReq("sendmessage",["cid","gid","value"],[connectionId,gid,value],alertifError);
}
function getmessagevalue(mid) {
	sendChatReq("getmessage",["cid","mid"],[connectionId,mid],function(mval) {putMessageValue(mval,mid)});
}
function addgroupmember(gid,uidadd) {
	sendChatReq("addgroupmember",["cid","gid","uidadd"],[connectionId,gid,uidadd],alertfunction);
}
function removegroupmember(gid,uidadd) {
	sendChatReq("removegroupmember",["cid","gid","uidadd"],[connectionId,gid,uidadd],alertfunction);
}
function getusermeta(uid) {
	sendChatReq("getusermeta",["uid"],[uid],function(m) {putUserMeta(uid,m)});
}
function setusermeta(meta) {
	sendChatReq("setusermeta",["cid","meta"],[connectionId,meta],alertfunction);
}
function getgroupmeta(gid) {
	sendChatReq("getgroupmeta",["cid","gid"],[connectionId,gid],function(m) {putGroupMeta(gid,m)});
}
function setgroupmeta(gid,meta) {
	sendChatReq("setgroupmeta",["cid","gid","meta"],[connectionId,gid,meta],alertfunction);
}
function getgroupinfo(gid) {
	sendChatReq("getgroupinfo",["cid","gid"],[connectionId,gid],function(m) {putGroupInfo(gid,m)});
}

function putMessages(msjson,gid,o) {
	var arr = JSON.parse(msjson);
	if (messageHeads[gid] == undefined) messageHeads[gid] = [];
	for (var i = 0; i < arr.length; i++) {
		messageHeads[gid][i+o] = arr[i];
	}
	if (AUTO_VALUE_LOAD) autovalload();
}
function putUserMeta(u,m) {
	try {
		usermeta[u] = JSON.parse(m);
	} catch (e) {usermeta[u] = undefined};
}
function putGroupMeta(g,m) {
	try {
		groupmeta[g] = JSON.parse(m);
	} catch (e) {groupmeta[g] = undefined};
}
function putGroupInfo(g,m) {
	try {
		groupinfo[g] = JSON.parse(m);
	} catch (e) {
		if (m == "") {
			groupinfo[g] = {};
		} else {
			groupinfo[g] = undefined;
		}
	};
}

function autovalload() {
	for (var i = 0; i < grouplist.length; i++) {
		if (messageHeads[grouplist[i]] == undefined) continue;
		for (var j = 0; j < messageHeads[grouplist[i]].length; j++) {
			if (messageHeads[grouplist[i]][j] == undefined) continue;
			if (getMessageValueById(messageHeads[grouplist[i]][j].id,false) == undefined) getmessagevalue(messageHeads[grouplist[i]][j].id);
		}
	}
}
function autogrmetainfoload() {
	for (var i = 0; i < grouplist.length; i++) {
		getgroupmeta(grouplist[i]);
		getgroupinfo(grouplist[i]);
	}
}
function autousermetaload() {
	var done = [];
	for (var i = 0; i < grouplist.length; i++) {
		if (messageHeads[grouplist[i]] == undefined) continue;
		for (var j = 0; j < messageHeads[grouplist[i]].length; j++) {
			if (messageHeads[grouplist[i]][j] == undefined) continue;
			var don = false;
			for (var k = 0; k < done.length; k++) {
				if (done[k] == messageHeads[grouplist[i]][j].sender) {
					don = true;
					break;
				}
			}
			if (!don) {
				getusermeta(messageHeads[grouplist[i]][j].sender);
				done[done.length] = messageHeads[grouplist[i]][j].sender;
			}
		}

	}
}
function putMessageValue(mval,mid) {
	messageValues[mid] = mval;
}
function getMessageValueById(mid) {
	return messageValues[mid];
}
function getGroupMetaById(gid) {
	return groupmeta[gid];
}
function getGroupInfoById(gid) {
	return groupinfo[gid];
}
function getUserMetaById(uid) {
	return usermeta[uid];
}
function putGrouplist(grouplistjson) {
	grouplist = JSON.parse(grouplistjson);
	if (AUTO_GRUOPMETA_AND_INFO_LOAD) autogrmetainfoload();
}
function setCid(cid) {
	connectionId = cid;
	checkcid();
}
function alertifError(s) {
	if (s.charAt(0) == "!") alertfunction(s.substring(1,s.length));
}


