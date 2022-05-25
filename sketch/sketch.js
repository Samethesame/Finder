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
let rslide;

let radius = 5;
let sRadius = 5;
let ncNode = -1;
let see = 3;

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

	rslide = createSlider (1, 5, 3);

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
	
	rMove = rslide.value ();
	
	if (see != rMove) {

		document.getElementById ('rtext').innerText = "see ahead: " + rMove;
		
		see = rMove;
	}

	for (i = 0; i < list.length; i++) {
	
		ellipse (list[i].x, list[i].y, radius * 2, radius * 2);
	}

	textSize (10 + radius);

	fill (255, 0, 0);

	//console.log(order.length);
	
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
	
	order = nSearch (saver, order, lower, 0, [], []).set;
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

	for (var a = 0; a < list.length; a++) {

		var hold = develop (a);

		if (shortL > hold.distance) {

			shortL = hold.distance;

			finalList = cloneArray (hold.set);
		}
	}

	return finalList;
}

function cloneArray (array) {

	return JSON.parse (JSON.stringify (array));
}

function nullAlt (length) {

	var clone = [];

	for (a = 0; a < length; a++) {

		clone[a] = null;
	}

	return clone;
}

function develop (noR) {
	
	var distance = 0;

	var cnt = 0

	var save = cloneArray (list);
	
	var removed = nullAlt (list.length);
	
	removed[cnt] = {val: save[noR], pos: noR};
	
	save[noR] = null;
	
	return nSearch (save, removed, cnt, distance, [], []);
}

function findN (array) {
	
	var allow = true;

	for (v in array) {

		if (array[v] === null) {
			
			return v - 1;
		}
	}

	return -1;
}

function nSearch (save, removed, cnt, distance, dF, rL) {

	var snV = (removed.length - cnt - 1) / see;

	var netDist = 0;

	var loopA = parseInt (snV, 10) + (snV % 1 > 0 ? 1 : 0);

	for (var a = 0; a < loopA; a++) {

		var call = findN (removed);
		
		var setC = list.length - call - 1 > see ? call + see: list.length - 1;

		var makeV = forNode (save, removed, call, distance, dF, rL, setC);
		
		save = makeV.save;

		removed = makeV.removed;
		
		netDist += makeV.distance;

		dF = [];

		rL = [];
		
		distance = 0;
	}

	return {distance: netDist, set: removed};
}

function forNode (save, removed, cnt, distance, dF, rL, cap) {
	
	var cLength = 2147483647;

	var cList = {};
	
	nSolve (save, removed, cnt, 0, distance, dF, rL, cap);

	for (var a = 0; a < dF.length; a++) {
	
		if (cLength > dF[a]) {

			cLength = dF[a];

			cList = cloneArray (rL[a]);
		}
	}

	return {distance: cLength, save: cList.save, removed: cList.removed};
}

function nSolve (save, removed, cnt, aV, distance, dF, rL, cap) {
	
	if (cnt === cap) {
	
		dF[dF.length] =  distance;

		rL[rL.length] = {save: save, removed: removed};
	
	} else if (cnt < cap) {

		extra (save, removed, cnt, aV, distance, dF, rL, cap);
	}
}

function extra (save, removed, cnt, aV, distance, dF, rL, cap) {

	if (aV < list.length) {

		if (save[aV] != null) {

			var combine = distance + dis (removed[cnt].val.x, removed[cnt].val.y, list[aV].x, list[aV].y);

			var addOn = cnt + 1;
			
			var cR = cloneArray (removed);

			var sR = cloneArray (save);

			cR[addOn] = {val: list[aV], pos: aV};
					
			sR[aV] = null;

			nSolve (sR, cR, addOn, 0, combine, dF, rL, cap);
		}

		aV++;

		nSolve (save, removed, cnt, aV, distance, dF, rL, cap);
	}
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
	rslide.parent ("rS");

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
