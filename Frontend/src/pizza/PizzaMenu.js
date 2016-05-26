/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
	//Очищаємо старі піци в кошику
	$pizza_list.html("");

	//Онволення однієї піци
	function showOnePizza(pizza) {
		var html_code = Templates.PizzaMenu_OneItem({
			pizza: pizza
		});

		var $node = $(html_code);

		$node.find(".buy-lg-button").click(function () {
			PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
		});
		$node.find(".buy-sm-button").click(function () {
			PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
		});

		$pizza_list.append($node);
	}

	list.forEach(showOnePizza);
}

function filterPizza(filter) {
	//Масив куди потраплять піци які треба показати
	var pizza_shown = [];

	Pizza_List.forEach(function (pizza) {
		if (filter === '') {
			pizza_shown.push(pizza);
		} else if ((filter === 'meat-filter' && pizza.content.meat) || (filter === 'mushrooms-filter' && pizza.content.mushroom) || (filter === 'pineapple-filter' && pizza.content.pineapple) ||
			(filter === 'ocean-filter' && pizza.content.ocean) ||
			(filter === 'vega-filter' && pizza.type === 'Вега піца')) {
			pizza_shown.push(pizza);
		}
	});

	//Показати відфільтровані піци
	showPizzaList(pizza_shown);
}

function initialiseMenu() {
	//Показуємо усі піци
	showPizzaList(Pizza_List)
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
