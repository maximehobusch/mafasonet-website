const LOCAL_STORAGE_KEY = "mfsnchatconfig";
const CATEGORIES_FILE_PATH = "stylecategories.json";
let userConfigs;
let timeoutrestyle = undefined;
let styleAlts = {};
function setStyleNoSave(styleTitle,styleCategorie) {
	styleAlts[styleCategorie].element.href = styleAlts[styleCategorie].alternatives[styleTitle].src;
	styleAlts[styleCategorie].element.disabled = true;
	styleAlts[styleCategorie].element.disabled = false;//<-- update
}
function getImplementedStyles(styleCategorie) {
	return Object.keys(styleAlts[styleCategorie].alternatives);
}
function getImplementedStyleCategories() {
	return Object.keys(styleAlts);
}
function pushNotDoubles(arr,v) {
	for (let i = 0; i < arr.length; i++) if (arr[i] == v) return;
	arr.push(v);
}

function setStyle(styleTitle,styleCategorie) {
	setStyleNoSave(styleTitle,styleCategorie);
	setUserConfigItem(styleCategorie,styleTitle);
}
function setUserConfigItem(cat,val) {
	userConfigs.styles[cat] = val;
	saveUserConfig();
}
function saveUserConfig() {
	localStorage.setItem(LOCAL_STORAGE_KEY,JSON.stringify(userConfigs));
}
function loadUserConfig() {
	let c;
	try {
		c = localStorage.getItem(LOCAL_STORAGE_KEY);
	} catch (e) {
	}
	if (c == undefined) {c = createDefaultUserConfig();} else {c = JSON.parse(c)};
	userConfigs = c;
}
function runUserConfig() {
	let k = Object.keys(userConfigs.styles);
	for (let i = 0; i < k.length; i++) {
		setStyleNoSave(userConfigs.styles[k[i]],k[i]);
	}
}

function createDefaultUserConfig() {
	return {"styles":{}};
}
function setUpStyleLoader() {//<---------------------------- RUN when onload
	loadUserConfig();
	loadStylesCategories();
}
function loadStylesCategories() {
	loadJSON(CATEGORIES_FILE_PATH,loadStyleCategoriesItems,function (e,m) {console.log("Can't load categories:" + e); loadStyleCategoriesItems([]);});
}
function loadStyleCategoriesItems(cats) {
	for (let i = 0; i < cats.length; i++) {
		styleAlts[cats[i].title] = {"alternatives":[],"element":addStyleLinkElement(cats[i].title)};
		loadJSON(cats[i].src,function(j) {addStyleCategorieItems(cats[i].title,j);},function(e) {console.log("Can't load categorie " + cats[i].title + " : " + e);});
	}
}
function addStyleLinkElement(cat) {
	let linkE = document.createElement("link");
	linkE.rel = "alternate stylesheet";
	linkE.type = "text/css";
	linkE.href = "";
	linkE.title = cat + ":";
	document.getElementsByTagName("head")[0].appendChild(linkE);
	return linkE;
}
function addStyleCategorieItems(cat,j) {
	if (j.length > 0 && userConfigs.styles[cat] == undefined) setUserConfigItem(cat,j[0].title);
	for (let i = 0; i < j.length; i++) addStyleCategorieItem(cat,j[i].title,j[i].src);
}
function addStyleCategorieItem(cat,title,src) {
	styleAlts[cat].alternatives[title] = {"src":src};
	if (timeoutrestyle != undefined) clearTimeout(timeoutrestyle);
	timeoutrestyle = window.setTimeout(runUserConfig,1000);
}
function loadJSON(pth,answerfunction,errorfunction) {
	var request = new XMLHttpRequest();
	request.open("GET",pth);
	request.overrideMimeType("application/json");
	request.send();
	request.addEventListener("error", function(event) {errorfunction("loading error");});
	request.addEventListener("abort", function(event) {errorfunction("loading abort!");});
	request.addEventListener('load', function(event) {
		let j;
		try {
			j = JSON.parse(request.responseText);
		} catch (e) {
			if (errorfunction != undefined) errorfunction(e,request.responseText);
		}
		answerfunction(j);
	});
}


