let video;
let canvas;
let radius = 5;
let list = [];

let snap;
let place;
let solve;
let slider;

function setup () {
	video = createCapture (VIDEO);
	video.size (640, 480);
	video.id ('video');
	video.parent ("top");

	canvas = createCanvas (640, 480);

	canvas.id ('canvas');
	canvas.parent ("bottom");

	slider = createSlider (1, 10);

	cset();
}

function draw() {

	background (0);

	translate (0, 0);

	image (video, 0, 0, width, width * video.length / video.width);

	fill (0, 255, 0, 50);

	radius = slider.value ();

	document.getElementById ('vtext').innerText = "node size: " + radius;

	for (var i = 0; i < list.length; i++) {
		ellipse (list[i].x, list[i].y, radius * 2, radius * 2);
	}
}

function mouseClicked () {

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

function cset () {

	snap = createButton ("capture");
	place = createButton ("place");
	solve = createButton ("solve");

	snap.parent ("baseA");
	place.parent ("baseB");
	slider.parent ("baseC");
	solve.parent ("baseD");

	snap.id ('snap');
	place.id ('place');
	solve.id ('solve');

	snap.style ('color', 'white');
	place.style ('color', 'white');
	solve.style ('color', 'white');

	snap.style('border', 'none');
	place.style('border', 'none');
	solve.style('border', 'none');

	snap.style ('width', '710px');
	place.style ('width', '710px');
	solve.style ('width', '710px');

	snap.style ('height', '20px');
	place.style ('height', '20px');
	solve.style ('height', '20px');

	snap.style('font-size', '16px');
	place.style('font-size', '16px');
	solve.style('font-size', '16px');

	snap.style ('background-color', '#000000');
	place.style ('background-color', '#004000');
	solve.style ('background-color', '#008000');

	snap.mousePressed (photo);
	place.mousePressed (placement);
	solve.mousePressed (solver);
}