let video;
let canvas;
let list = [];
let order = [];

let snap;
let place;
let solve;
let elect;
let changer;

let areset;
let aslider;

let radius = 5;
let sRadius = 5;
let ncNode = -1;

function setup () {
	video = createCapture (
		{
			audio: false,
			video: {facingMode: 'environment'}
		}
	);
	
	video.size (640, 480);
	video.id ('video');
	video.parent ("top");

	canvas = createCanvas (640, 480);

	canvas.id ('canvas');
	canvas.parent ("bottom");

	aslider = createSlider (1, 10, 5);

	cset();

	canvas.mouseReleased (rclick);
}

function draw() {

	background (0);

	translate (0, 0);

	image (video, 0, 0, width, width * video.length / video.width);

	fill (0, 255, 0, 200);

	radius = aslider.value ();

	if (sRadius != radius) {
		
		document.getElementById ('vtext').innerText = "node size: " + radius;
		
		sRadius = radius;
	}
	
	for (i = 0; i < list.length; i++) {
	
		ellipse (list[i].x, list[i].y, radius * 2, radius * 2);
	}

	textSize (10 + radius);

	fill (255, 0, 0);

	for (l = 0; l < order.length; l++) {

		text (l + 1, order[l].val.x + 2 + radius * 2, order[l].val.y + 2 + radius * 2);
	}
}

function rclick () {

	if (document.getElementById ('place').innerText === "stop placement") {

  		list[list.length] = {x: mouseX, y: mouseY};
	}
	
	if (document.getElementById ('elect').innerText === "stop select solve") {
  	
		locator ();
	}

	var sChangeV = document.getElementById ('changer');

	if (order.length > 0 && order.length === list.length) {

		if (sChangeV.innerText === "select new node position") {

			ncNode = muFind ();

			sChangeV.innerText = "select new node";

		} else if (ncNode > -1) {

			changeNode ();

			ncNode = -1;

			sChangeV.innerText = "change";
		}
	} else {
	
		sChangeV.innerText = "change";
	}
}

function photo () {

	var snap = document.getElementById ('snap');

	if (snap.innerText === "capture") {

		video.pause();

		snap.innerText = "redocap";
	} else {
		snap.innerText = "capture";

		video.play();

		list = [];
		order = [];
	}
}

function placement () {

	var place = document.getElementById ('place');

	if (place.innerText === "place") {
				
		place.innerText = "stop placement";
	} else {
		place.innerText = "place";
	}
}

function solver () {

	var solve = document.getElementById ('solve');

	if (solve.innerText === "solve") {

		solve.innerText = "stop solve";

		//finds the shortest path between nodes
		order = finder ();
	} else {
		solve.innerText = "solve";

		order = [];
	}
}

function election () {

	var place = document.getElementById ('elect');

	if (place.innerText === "select solve") {

		place.innerText = "stop select solve";
	} else {
		place.innerText = "select solve";
	}
}

function cselect () {

	var moveV = document.getElementById ('changer');

	if (moveV.innerText === "change") {

 		document.getElementById ('place').innerText = "place";

		document.getElementById ('solve').innerText = "solve";

		document.getElementById ('elect').innerText = "select solve";

		moveV.innerText = "select new node position";
	} else {
		ncNode = -1;

		moveV.innerText = "change";
	}
}

function changeNode () {

	if (order.length > 0) {

		var cNod = muFind ();

		var findA = getOrder (ncNode);
		
		var findB = getOrder (cNod);
		
		var save = order[findA];
		
		order[findA] = order[findB];
		
		order[findB] = save;
		
		changeVM (findA, findB);
	}
}

function changeVM (findA, findB) {

	var saver = cloneArray (list);

	var lower = findA > findB ? findB : findA;

	for (i = 0; i < order.length; i++) {

		if (i < lower + 1) {
			
			saver[order[i].pos] = null;

		} else {
			order[i] = null;
		}
	}

	for (l = lower + 1; l < order.length; l++) {
		
		var account = forNode (saver, order, l - 1);

		order[l] = {val: saver[account.sNode], pos: account.sNode};

		saver[account.sNode] = null;
	}
}

function getOrder (value) {

	for (i = 0; i < order.length; i++) {

		if (value === order[i].pos) {
			
			return i;
		}
	}

	return -1;
}

function locator () {

	if (list.length > 0) {

		var cNod = muFind ();

		order = develop (cNod).set;
	}
}

function muFind () {

	//finds the closest node to the mouse
	var distance = 2147483647;
	var cNode = -1;

	for (i = 0; i < list.length; i++) {

		var change = dis (mouseX, mouseY, list[i].x, list[i].y);

		if (distance > change) {

			distance = change;
			cNode = i;
		}
	}

	return cNode;
}

function finder () {

	var finalList = [];

	var shortL = 2147483647;
	for (a = 0; a < list.length; a++) {

		var hold = develop (a);

		if (shortL > hold.distance) {
			console.log(hold.distance + " " a);
			shortL = hold.distance;

			finalList = cloneArray (hold.set);
		}
	}

	return finalList;
}

function cloneArray (array) {

	var clone = [];

	for (v in array) {

		clone[v] = array[v];
	}

	return clone;
}

function nullAlt (length) {

	var clone = [];

	for (a = 0; a < length; a++) {

		clone[a] = null;
	}

	return clone;
}

function develop (noR) {

	var cnt = 0;

	var distance = 0;

	var save = cloneArray (list);
	var removed = nullAlt (list.length);

	removed[cnt] = {val: save[noR], pos: noR};

	save[noR] = null;

	for (a = 0; a < list.length - 1; a++) {

		var e = forNode (save, removed, cnt);

		distance += e.shortL;

		cnt++;

		removed[cnt] = {val: save[e.sNode], pos: e.sNode};

		save[e.sNode] = null;
	}

	return {distance: distance, set: removed};
}

function forNode (save, removed, cnt) {

	var sNode = -1;
	var shortL = 2147483647;

	for (b = 0; b < list.length; b++) {

		if (save[b] != null) {
			
			var sizeL = dis (removed[cnt].val.x, removed[cnt].val.y, save[b].x, save[b].y);

			if (shortL > sizeL) {

				shortL = sizeL;

				sNode = b;
			}
		}
	}

	return {shortL: shortL, sNode: sNode};
}

function dis (ax, ay, bx, by) {

	return Math.sqrt ((ax - bx) * (ax - bx) + (ay - by) * (ay - by));
}

function mreset () {
	
	list = [];
	order = [];
}

function cset () {

	snap = createButton ("capture");
	place = createButton ("place");
	solve = createButton ("solve");
	areset = createButton ("reset");
	elect = createButton ("select solve");
	changer = createButton ("change");

	snap.parent ("baseA");
	place.parent ("baseB");
	aslider.parent ("baseC");
	solve.parent ("baseD");
	areset.parent ("space");
	elect.parent ("aElect");
	changer.parent ("cSelect");

	snap.id ('snap');
	place.id ('place');
	solve.id ('solve');
	areset.id ('areset');
	elect.id ('elect');
	changer.id ('changer');

	coloring ();
	
	snap.mousePressed (photo);
	place.mousePressed (placement);
	solve.mousePressed (solver);
	areset.mousePressed (mreset);
	elect.mousePressed (election);
	changer.mousePressed (cselect);
}

function coloring() {

	snap.style ('color', 'white');
	place.style ('color', 'white');
	solve.style ('color', 'white');
	areset.style ('color', 'white');
	elect.style ('color', 'white');
	changer.style ('color', 'white');

	snap.style ('border', 'none');
	place.style ('border', 'none');
	solve.style ('border', 'none');
	areset.style ('border', 'none');
	elect.style ('border', 'none');
	changer.style ('border', 'none');

	snap.style ('width', '710px');
	place.style ('width', '710px');
	solve.style ('width', '710px');
	areset.style ('width', '710px');
	elect.style ('width', '710px');
	changer.style ('width', '710px');

	snap.style ('height', '20px');
	place.style ('height', '20px');
	solve.style ('height', '20px');
	areset.style ('height', '20px');
	elect.style ('height', '20px');
	changer.style ('height', '20px');

	snap.style ('font-size', '16px');
	place.style ('font-size', '16px');
	solve.style ('font-size', '16px');
	areset.style ('font-size', '16px');
	elect.style ('font-size', '16px');
	changer.style ('font-size', '16px');

	snap.style ('background-color', '#000000');
	place.style ('background-color', '#002000');
	areset.style ('background-color', '#004000');
	solve.style ('background-color', '#006000');
	elect.style ('background-color', '#008000');
	changer.style ('background-color', '#00a000');
}
