/**
 * Created by chaika on 25.01.16.
 */

$(function () {
	//This code will execute when the page is ready
	var PizzaMenu = require('./pizza/PizzaMenu');
	var PizzaCart = require('./pizza/PizzaCart');
	var Pizza_List = require('./Pizza_List');

	PizzaCart.initialiseCart();
	PizzaMenu.initialiseMenu();

	$("#all-pizza-filter").click(function () {
		PizzaMenu.filterPizza('');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#meat-pizza-filter").click(function () {
		PizzaMenu.filterPizza('meat');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#seefood-pizza-filter").click(function () {
		PizzaMenu.filterPizza('ocean');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#mushroom-pizza-filter").click(function () {
		PizzaMenu.filterPizza('mushroom');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#pineapple-pizza-filter").click(function () {
		PizzaMenu.filterPizza('pineapple');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$("#no-meat-pizza-filter").click(function () {
		PizzaMenu.filterPizza('no-meat');
		$('.nav li').removeClass('active');
		$(this).addClass('active');
	});

	$('#clear-order').click(function () {
		PizzaCart.removeAll();
	});
});
