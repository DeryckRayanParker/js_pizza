var map;
var ClientPoint;
var PizzaHome = new google.maps.LatLng(50.464379, 30.519131);

var DirectionsDisplay = new google.maps.DirectionsRenderer;

function geocodeLatLng(latlng, callback) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'location': latlng
	}, function (results, status) {
		if (status === google.maps.GeocoderStatus.OK && results[1]) {
			var adress = results[1].formatted_address;
			callback(null, adress);
		} else {
			callback(new Error("Can't find adress"));
		}
	});
}

function geocodeAddress(adress, callback) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address': adress
	}, function (results, status) {
		if (status === google.maps.GeocoderStatus.OK && results[0]) {
			var coordinates = results[0].geometry.location;
			calculateRoute(PizzaHome, coordinates, function (error, time) {
				if(!error){
					$('#info-delivery-time').html(time.duration.text);
				}
			});

			if (ClientPoint) {
				ClientPoint.setMap(null);
			}

			var mePoint = new google.maps.LatLng(coordinates.lat(), coordinates.lng());
			ClientPoint = new google.maps.Marker({
				position: mePoint,
				map: map,
				icon: "assets/images/home-icon.png"
			});
			callback(null, coordinates);
		} else {
			callback(new Error("Can not find the adress"));			
		}
	});
}

function calculateRoute(A_latlng, B_latlng, callback) {
	var directionService = new google.maps.DirectionsService();
	directionService.route({
		origin: A_latlng,
		destination: B_latlng,
		travelMode: google.maps.TravelMode["DRIVING"]
	}, function (response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			var leg = response.routes[0].legs[0];
			DirectionsDisplay.setDirections(response);
			callback(null, {
				duration: leg.duration
			});
		} else {
			callback(new Error("Can' not find direction"));
		}
	});
}


var initialize = function () {
	var mapProp = {
		center: new google.maps.LatLng(50.464379, 30.519131),
		zoom: 13
	};
	var html_element = document.getElementById("map-container");
	map = new google.maps.Map(html_element, mapProp);

	DirectionsDisplay.setMap(map);
	DirectionsDisplay.setOptions({
		suppressMarkers: true
	});

	var marker = new google.maps.Marker({
		position: PizzaHome,
		map: map,
		icon: "assets/images/map-icon.png"
	});

	//adding listener
	google.maps.event.addListener(map, 'click', function (me) {
		var coordinates = me.latLng;
		geocodeLatLng(coordinates, function (err, adress) {
			if (!err) {
				$('#info-address').html(adress);
				$('#address-input').val(adress);
				calculateRoute(PizzaHome, me.latLng, function (error, time) {
					$('#info-delivery-time').html(time.duration.text);
				});
				$('#address-input-error').hide();
				$('#null-address-input-error').hide();

				$('#address-grp').removeClass('has-error');
				$('#address-grp').addClass('has-success');
			} else {
				console.error("Немає адреси");
			}
		});

		if (ClientPoint) {
			ClientPoint.setMap(null);
		}

		var mePoint = new google.maps.LatLng(me.latLng.lat(), me.latLng.lng());
		ClientPoint = new google.maps.Marker({
			position: mePoint,
			map: map,
			icon: "assets/images/home-icon.png"
		});
	});

}



var init = function () {
	google.maps.event.addDomListener(window, 'load', initialize);
}

exports.init = init;
exports.geocodeAddress = geocodeAddress;
