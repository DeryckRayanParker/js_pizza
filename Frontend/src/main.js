/**
 * Created by chaika on 25.01.16.
 */

$(function () {
	//This code will execute when the page is ready
	var PizzaMenu = require('./pizza/PizzaMenu');
	var PizzaCart = require('./pizza/PizzaCart');
	var API = require('./API');

	var map = require('./googleMap');

	PizzaCart.initialiseCart();
	PizzaMenu.initialiseMenu();

	//sorting buttons
	$("#all-pizza-filter").click(function () {
		PizzaMenu.filterPizza('');
		$("#filter-title").html($(this).find('a').html() + ' піци');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#meat-pizza-filter").click(function () {
		PizzaMenu.filterPizza('meat');
		$("#filter-title").html($(this).find('a').html());
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#seefood-pizza-filter").click(function () {
		PizzaMenu.filterPizza('ocean');
		$("#filter-title").html($(this).find('a').html());
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#mushroom-pizza-filter").click(function () {
		PizzaMenu.filterPizza('mushroom');
		$("#filter-title").html($(this).find('a').html());
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#pineapple-pizza-filter").click(function () {
		PizzaMenu.filterPizza('pineapple');
		$("#filter-title").html($(this).find('a').html());
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#no-meat-pizza-filter").click(function () {
		PizzaMenu.filterPizza('no-meat');
		$("#filter-title").html($(this).find('a').html());
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$('#clear-order').click(function () {
		PizzaCart.removeAll();
	});

	//right-panel func
	$('#order-btn').click(function () {
		window.location = '/order.html';
	});

	$('#edit-order-btn').click(function () {
		window.location = '/';
	});

	//order-form
	$('#name-input').on('input', function (event) {
		var filter = /^[a-zA-Zа-яА-ЯіІїЇєЄ' ]+$/;
		if (!($(this).val().match(filter))) {
			if (!($(this).val())) {
				$('#name-input-error').hide();
				$('#null-name-input-error').show();
			} else {
				$('#null-name-input-error').hide();
				$('#name-input-error').show();
			}
			$('#name-grp').removeClass('has-success');
			$('#name-grp').addClass('has-error');
		} else {
			$('#name-input-error').hide();
			$('#null-name-input-error').hide();

			$('#name-grp').removeClass('has-error');
			$('#name-grp').addClass('has-success');
		}
	});

	$('#phone-input').on('input', function (event) {
		var filter = /^(\+38)?(0)[0-9]{9}$/;
		if (!($(this).val().match(filter))) {
			if (!($(this).val())) {
				$('#phone-input-error').hide();
				$('#null-phone-input-error').show();
			} else {
				$('#null-phone-input-error').hide();
				$('#phone-input-error').show();
			}
			$('#phone-grp').removeClass('has-success');
			$('#phone-grp').addClass('has-error');
		} else {
			$('#phone-input-error').hide();
			$('#null-phone-input-error').hide();

			$('#phone-grp').removeClass('has-error');
			$('#phone-grp').addClass('has-success');
		}
	});

	$('#address-input').on('input', function (event) {
		var filter = /^[a-zA-Zа-яА-ЯіІїЇєЄ0-9\s\,\'\. -]+$/;
		$('#info-address').html($(this).val());
		if (!($(this).val().match(filter))) {
			if (!($(this).val())) {
				$('#address-input-error').hide();
				$('#null-address-input-error').show();
			} else {
				$('#null-address-input-error').hide();
				$('#address-input-error').show();
			}
			$('#address-grp').removeClass('has-success');
			$('#address-grp').addClass('has-error');
		} else {
			$('#address-input-error').hide();
			$('#null-address-input-error').hide();

			$('#address-grp').removeClass('has-error');
			$('#address-grp').addClass('has-success');
		}
		map.geocodeAddress($(this).val(), function (err) {
			if (!err) {
				$('#address-input-error').hide();
				$('#null-address-input-error').hide();

				$('#address-grp').removeClass('has-error');
				$('#address-grp').addClass('has-success');
			} else {
				$('#null-address-input-error').hide();
				$('#address-input-error').show();
				$('#address-grp').removeClass('has-success');
				$('#address-grp').addClass('has-error');
			}
		});
	});

	$('#btn-next').click(function () {
		if (!($('#name-grp').hasClass('has-error')) && !($('#phone-grp').hasClass('has-error')) && !($('#address-grp').hasClass('has-error'))) {
			var err = false;
			if (!($('#name-input').val())) {
				$('#null-name-input-error').show();
				$('#name-input-error').hide();
				$('#name-grp').removeClass('has-success');
				$('#name-grp').addClass('has-error');
				err = true;
			}
			if (!($('#phone-input').val())) {
				$('#null-phone-input-error').show();
				$('#phone-input-error').hide();
				$('#phone-grp').removeClass('has-success');
				$('#phone-grp').addClass('has-error');
				err = true;
			}
			if (!($('#address-input').val())) {
				$('#null-address-input-error').show();
				$('#address-input-error').hide();
				$('#address-grp').removeClass('has-success');
				$('#address-grp').addClass('has-error');
				err = true;
			}
			if (!err) {
				API.createOrder({
					name: $('#name-input').val(),
					phone: $('#phone-input').val(),
					address: $('#address-input').val(),
					cart: PizzaCart.getPizzaInCart(),
					totalPrice: $('#summary-total-counter').html()
				}, function (err, res) {
					if (!err) {
						LiqPayCheckout.init({
							data: res.data,
							signature: res.signature,
							embedTo: "#liqpay",
							mode: "popup"
						}).on("liqpay.callback", function (data) {
							if (data.status === "success" || data.status === "sandbox") {
								alert("Дякуємо за покупку!");
								//window.location = "/";
							}
							else{
								alert("Помилка транзакції =(");
							}
						}).on("liqpay.ready", function (data) {

						}).on("liqpay.close", function (data) {

						});

					} else {
						console.error(err);
					}
				});
			}
		}
	});

	map.init();

});
