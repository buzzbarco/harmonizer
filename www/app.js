var slider;
var colorPicker;

$(function(){
	/*$(".colourpicker").minicolors({
		control: 'hue',
		format: 'hex',
		inline: true,
		letterCase: 'lowercase',
		changeDelay: 5,
		opacity: false,
		position: 'bottom',
		swatches: [],
		change: colourChange,
		theme: 'default'
	});*/

	colorPicker = new iro.ColorPicker('.colourpicker', {
		color: '5cacff',
		width: $('#app').width()-100,
		layoutDirection: 'horizontal'
	});
	colorPicker.on('color:change', colourChange);

	slider = document.getElementById('distance');
	noUiSlider.create(slider, {
		start: [0.6],
		connect: true,
		range: {
			'min': 0.1,
			'max': 1
		}
	});
	slider.noUiSlider.on('update', colourChange);

	colourChange();
});

window.addEventListener("resize", function(){});



var data = {
	mainColour: '36f',
	harmonies: [
		//{ 'colours': ['#ffffff', '#000000'] }
	],
	onColourChange: colourChange
}

function colourChange()
{
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
	var harmony = {'harmony':'complimentary', 'colours': []};
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, 180)));
	data.harmonies.push(harmony);

	// adjacent
	var harmony = {'harmony':'adjacent', 'colours': []};
	deg = 90*distance;
	harmony.colours.push(hslToString(rotateHue(hsl, deg)));
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, -deg)));
	data.harmonies.push(harmony);

	// triad
	var harmony = {'harmony':'triad', 'colours': []};
	deg = 180-100*distance;
	harmony.colours.push(hslToString(rotateHue(hsl, deg)));
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, -deg)));
	data.harmonies.push(harmony);

	// double triad
	var harmony = {'harmony':'double triad', 'colours': []};
	deg = 150-100*distance;
	harmony.colours.push(hslToString(rotateHue(hsl, deg)));
	harmony.colours.push(hslToString(rotateHue(hsl, deg*1.4)));
	harmony.colours.push(hslToString(hsl));
	harmony.colours.push(hslToString(rotateHue(hsl, -deg)));
	harmony.colours.push(hslToString(rotateHue(hsl, -deg*1.4)));
	data.harmonies.push(harmony);

	// tetrad
	var harmony = {'harmony':'tetrad', 'colours': []};
	deg = 90*distance;
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
};