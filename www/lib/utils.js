//disable double tap
var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
	var now = (new Date()).getTime();
	if (now - lastTouchEnd <= 300) {
		event.preventDefault();
	}
	lastTouchEnd = now;
}, false);

// disable zoom
document.addEventListener('gesturestart', function (e) {
	e.preventDefault();
});