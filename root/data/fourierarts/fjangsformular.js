var FjangsFormular = {};
FjangsFormular.createInputFormular = function(data,name,valueoutput,tableporperties) {
	if (name == undefined) name = "fjangsformular";
	if (tableporperties == undefined) tableporperties = {};
	let f = document.createElement("form",{"name":name});
	let tble = document.createElement("table");
	FjangsFormular.addAttrs(tble,tableporperties);
	let tbdy = document.createElement("tbody");
	for (let i = 0; i < data.length; i++) {
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		td1.appendChild(document.createTextNode(data[i].title));
		let td2 = document.createElement("td");
		let inpt = document.createElement("input");
		FjangsFormular.addAttrs(inpt,data[i]);
		td2.appendChild(inpt);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tbdy.appendChild(tr);
	}
	let tr = document.createElement("tr");
	let td = document.createElement("td");
	let butt = document.createElement("input");
	FjangsFormular.addAttr(butt,"type","button");
	FjangsFormular.addAttr(butt,"value","Ok");
	butt.valueoutput = valueoutput;
	butt.onclick = function() {
		if (this.valueoutput != undefined) this.valueoutput(FjangsFormular.createOutput(this.form));
	}
	td.appendChild(butt);
	tr.appendChild(td);
	tbdy.appendChild(tr);
	tble.appendChild(tbdy);
	f.appendChild(tble);
	return f;
}
FjangsFormular.createOutput = function(f) {
	let r = {};
	let es = f.elements;
	for (let i = 0; i < es.length; i++) {
		if (es[i].name != undefined && es[i].name != "") r[es[i].name] = es[i].value;
	}
	return r;
}
FjangsFormular.addAttr = function(el,n,v) {
	let a = document.createAttribute(n);
	a.value = v;
	el.setAttributeNode(a); 
}
FjangsFormular.addAttrs = function(el,obj) {
	let k = Object.keys(obj);
	for (let i = 0; i < k.length; i++) {
		FjangsFormular.addAttr(el,k[i],obj[k[i]]);
	}
}
