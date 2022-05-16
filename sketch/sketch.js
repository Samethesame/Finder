let video;
let canvas;
let radius = 5;
let list = [];

let snap;
let place;
let solve;
let areset;
let aslider;

function setup () {
	video = createCapture (VIDEO);
	video.size (640, 480);
	video.id ('video');
	video.parent ("top");

	canvas = createCanvas (640, 480);

	canvas.id ('canvas');
	canvas.parent ("bottom");

	aslider = createSlider (1, 10);

	cset();

	canvas.mouseClicked (rclick);
}

function draw() {

	background (0);

	translate (0, 0);

	image (video, 0, 0, width, width * video.length / video.width);

	fill (0, 255, 0, 50);

	radius = aslider.value ();

	document.getElementById ('vtext').innerText = "node size: " + radius;

	for (var i = 0; i < list.length; i++) {
		ellipse (list[i].x, list[i].y, radius * 2, radius * 2);
	}
}

function rclick () {

	if (document.getElementById ('place').innerText === "stop placement") {

  		list[list.length] = {x: mouseX, y: mouseY};
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
	} else {
		solve.innerText = "solve";
	}
}

function mreset () {
	
	list = [];
}

function cset () {

	snap = createButton ("capture");
	place = createButton ("place");
	solve = createButton ("solve");
	areset = createButton ("reset");

	snap.parent ("baseA");
	place.parent ("baseB");
	aslider.parent ("baseC");
	solve.parent ("baseD");
	areset.parent ("space");

	snap.id ('snap');
	place.id ('place');
	solve.id ('solve');
	areset.id ('areset');

	snap.style ('color', 'white');
	place.style ('color', 'white');
	solve.style ('color', 'white');
	areset.style ('color', 'white');

	snap.style('border', 'none');
	place.style('border', 'none');
	solve.style('border', 'none');
	areset.style('border', 'none');

	snap.style ('width', '710px');
	place.style ('width', '710px');
	solve.style ('width', '710px');
	areset.style ('width', '710px');

	snap.style ('height', '20px');
	place.style ('height', '20px');
	solve.style ('height', '20px');
	areset.style ('height', '20px');

	snap.style ('font-size', '16px');
	place.style ('font-size', '16px');
	solve.style ('font-size', '16px');
	areset.style ('font-size', '16px');

	snap.style ('background-color', '#000000');
	place.style ('background-color', '#003000');
	areset.style ('background-color', '#006000');
	solve.style ('background-color', '#009000');

	snap.mousePressed (photo);
	place.mousePressed (placement);
	solve.mousePressed (solver);
	areset.mousePressed (mreset);
}
