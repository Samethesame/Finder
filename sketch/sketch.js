/*var video;
var canvas;
var radius = 5;
var list = [];

function setup() {
	video = createCapture (VIDEO);
	video.size (640, 480);
	video.id ('video');
	video.parent ("top");

	canvas = createCanvas (640, 480);

	canvas.id ('canvas');
	canvas.parent ("bottom");
}

function draw() {

	background (0);

	translate (0, 0);

	if (document.getElementById ('snap').innerText === "redocap") {

		document.getElementById ('video').pause();
	} else {

	document.getElementById ('video').play();
	}

	image (video, 0, 0, width, width * video.length / video.width);

	fill (0, 255, 0, 50);

	for (var i = 0; i < list.length; i++) {
		ellipse (list[i].x, list[i].y, radius * 2, radius * 2);
	}
}

function mouseClicked() {

	if (document.getElementById ('place').innerText === "stop placement") {

  		list[list.length] = {x: mouseX, y: mouseY};
	}
}*/
