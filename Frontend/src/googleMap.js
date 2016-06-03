 var initialize = function() {
	var mapProp = {
		center: new google.maps.LatLng(50.464379, 30.519131),
		zoom: 13
	};
	var html_element = document.getElementById("map-container");
	var map = new google.maps.Map(html_element, mapProp);
}
var init = function () {
	google.maps.event.addDomListener(window, 'load', initialize);
}

exports.init = init;
