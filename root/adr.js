var httpi = "http://";
function toFabinet() {
	if (window.location.hostname == "") {
		alert("Sie haben die Webseite heruntergeladen... \nDeshalb ist die IP-Adresse das Parallelservers unbekannt");
		return;
	}
	if (window.location.hostname == "privat-pro-7000x") {// Damit das in meinem WLAN auch funktioniert
		window.open(httpi + window.location.hostname + ":8880","_blank");
	} else {
		var link = httpi + window.location.hostname + ":25680";
		window.open(link,"_blank");
	}
}


function toFabinetDat(d) {
	if (window.location.hostname == "") {
		alert("Sie haben die Webseite heruntergeladen... \nDeshalb ist die IP-Adresse das Parallelservers unbekannt");
		return;
	}
	if (window.location.hostname == "privat-pro-7000x") {// Damit das in meinem WLAN auch funktioniert
		window.open(httpi + window.location.hostname + ":8880" + d,"_blank");
	} else {
		var link = httpi + window.location.hostname + ":25680" +d;
		window.open(link,"_blank");
	};
}
