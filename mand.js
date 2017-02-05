var MAX_ITERATIONS = 300;
var radius = 2;
var center = {
	re: 0,
	im: 0
}
var WIDTH = 0;
var HEIGHT = 0;

$(document).ready(function() {
	var canvas = document.getElementById('canvas');
	canvas.addEventListener("click", function(e) {
		getCanvasXY(e);
		draw(canvas);
	});
	draw(canvas);
});

function draw(canvas) {
	var ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(canvas.width, canvas.height);
	
	WIDTH = imageData.width;
	HEIGHT = imageData.height;
	
	for(var x=0; x<canvas.width; x++) {
		for(var y=0; y<canvas.width; y++) {
			setValue(imageData, x, y, mandlebrot(x, y));			
		}
	}
	
	ctx.putImageData(imageData, 0, 0);
}

function setValue(imageData, x, y, value) {
	if(value == -1) {
		setColor(imageData, x, y, 0, 0, 0, 255);
	} else {
		var rgb = HSVtoRGB(value/MAX_ITERATIONS, 1, 1);
		setColor(imageData, x, y, rgb.r, rgb.g, rgb.b, 255);
	}
}

function setColor(imageData, x, y, R, G, B, A) {
	imageData.data[y*WIDTH*4 + x*4] = R;
	imageData.data[y*WIDTH*4 + x*4 + 1] = G;
	imageData.data[y*WIDTH*4 + x*4 + 2] = B;
	imageData.data[y*WIDTH*4 + x*4 + 3] = A;
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function mandlebrot(x, y) {
	var c = map(x, y);
	var value = 0;
	var part = fc({re:0,im:0}, c);
	while(value<MAX_ITERATIONS && valid(part)) {
		value++;
		part = fc(part, c);
	}
	if(value == MAX_ITERATIONS) {
		return -1;
	}
	else {
		return value;
	}
}

function map(x, y) {
	return {
		re: (x - WIDTH/2)*radius/(WIDTH/2) + center.re,
		im: (HEIGHT/2 - y)*radius/(HEIGHT/2) + center.im
	};
}

function fc(x, c) {
	return sum(mul(x, x), c);
}

function sum(a, b) {
	return {
		re: a.re + b.re,
		im: a.im + b.im
	};
}

function mul(a, b) {
	return {
		re: a.re*b.re - a.im*b.im,
		im: a.re*b.im + b.re*a.im
	};
}

function valid(n) {
	return Math.abs(n.re)<=2 && Math.abs(n.im)<=2;
}

function getCanvasXY(e) {
	var x;
	var y;
	if (e.pageX || e.pageY) { 
	  x = e.pageX;
	  y = e.pageY;
	}
	else { 
	  x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
	  y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	center = map(x, y);
	radius = radius/4;
} 