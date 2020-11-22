import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;

var slider;
var colorPicker;
var canvas = document.createElement('canvas');

$(function(){

	createColourWheel();

	slider = document.getElementById('distance');
	noUiSlider.create(slider, {
		start: [0.6],
		connect: true,
		range: {
			'min': 0,
			'max': 1
		}
	});
	slider.noUiSlider.on('update', colourChange);

	colourChange();

	$('body').on('click', '.get-image', getImage);

	$('body').on('click mousemove mousedown', '#image-preview', pickColour);
});

function pickColour(event)
{
	event.preventDefault();

	var img = document.getElementById('image-preview');
	canvas.width = img.width;
	canvas.height = img.height;
	canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
	var pixelData = canvas.getContext('2d').getImageData(event.offsetX, event.offsetY, 1, 1).data;

	// get the current hsv value
	//var hsv = color.hsv;
	// make changes to it
	//colorPicker.color.r = pixelData[0];
	//colorPicker.color.g = pixelData[1];
	//colorPicker.color.b = pixelData[2];
	// set the color without triggering color:change
	//color.set(hsv);
	// manually force the UI to update if you want
	colorPicker.color.rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2] };

	refresh();

	//colorPicker.color = 'rgb('+pixelData[0]+','+pixelData[1]+','+pixelData[2]+')';
}

//window.addEventListener("resize", function(){});

// make global for Alpine
window.data = {
	mainColour: '5cacff',
	image: '',
	harmonies: [
		//{ 'colours': ['#ffffff', '#000000'] }
	],
	selected: '',
	pickingFromImage: false,
	onColourChange: colourChange,
	createColourWheel: createColourWheel
}

function createColourWheel()
{
	data.pickingFromImage = false;
	refresh();

	setTimeout(function () {
		colorPicker = new iro.ColorPicker('.colourpicker', {
			color: data.mainColour,
			width: $('#app').width()-100,
			layoutDirection: 'horizontal'
		});
		colorPicker.on('color:change', colourChange);
		colourChange();
	}, 200);
}

function colourChange()
{
	if(!colorPicker) return;
	//data.mainColour = $('.colourpicker').val();
	data.mainColour = colorPicker.color.hexString;
	data.mainColour = data.mainColour.toLowerCase();
	var hsl = hexToHsl(data.mainColour);

	var distance = 0.5;
	if(slider.noUiSlider) distance = slider.noUiSlider.get();

	if(hsl==null) return;

	data.harmonies = [];
	var deg;

	// complimentary
	var harmony = {harmony:'complimentary', colours: []};
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, 180)));
	data.harmonies.push(harmony);

	// adjacent
	var harmony = {harmony:'adjacent', colours: []};
	deg = 20+40*distance;
	harmony.colours.push(hslToString(rotateHue(hsl, deg)));
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, -deg)));
	data.harmonies.push(harmony);

	// triad
	var harmony = {harmony:'triad', colours: []};
	deg = 180-10-50*distance;
	harmony.colours.push(hslToString(rotateHue(hsl, deg)));
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, -deg)));
	data.harmonies.push(harmony);

	// double triad
	var harmony = {harmony:'double triad', colours: []};
	deg = 10+30*distance;
	harmony.colours.push(hslToString(rotateHue(hsl, 180-deg*2)));
	harmony.colours.push(hslToString(rotateHue(hsl, 180-deg)));
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, 180+deg)));
	harmony.colours.push(hslToString(rotateHue(hsl, 180+deg*2)));
	data.harmonies.push(harmony);

	// tetrad
	var harmony = {harmony:'tetrad', colours: []};
	deg = 10+80*distance;
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, deg)));
	harmony.colours.push(hslToString(rotateHue(hsl, 180)));
	harmony.colours.push(hslToString(rotateHue(hsl, 180+deg)));
	data.harmonies.push(harmony);

	refresh();
}

function rotateHue(hsl, deg)
{
	var hsl2 = {h: hsl.h, s: hsl.s, l: hsl.l};
	hsl2.h += deg % 360;
	return hsl2;
}

function hslToString(hsl)
{
	return 'hsl('+hsl.h+','+(hsl.s*100)+'%,'+(hsl.l*100)+'%)';
}

function hexToHsl(hex)
{
	var c = w3color(hex);
	if (c.valid)
	{
		return c.toHsl();
	}
	else return null;
}

function refresh() {
	document.querySelector('[x-data]').__x.$data.refresh++;
}

async function getImage()
{
	const image = await Camera.getPhoto({
		quality: 90,
		allowEditing: true,
		resultType: CameraResultType.Uri
	});
	// image.webPath will contain a path that can be set as an image src.
	// You can access the original file using image.path, which can be
	// passed to the Filesystem API to read the raw data of the image,
	// if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
	// Can be set to the src of an image now
	var imgPath = image.webPath;
	//$('#image-preview').attr('src', imgPath);
	data.image = imgPath;
	data.pickingFromImage = true;
	refresh();
}