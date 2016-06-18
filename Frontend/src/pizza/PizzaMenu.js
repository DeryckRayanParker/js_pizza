/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = null;
var API = require('../API');

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
		} else if (pizza.content[filter]||
			(filter === 'no-meat' && (pizza.type==='Вега піца'))) {
			pizza_shown.push(pizza);
		}
	});

	//Показати відфільтровані піци
	showPizzaList(pizza_shown);
	$('#all-pizzas-counter').html(pizza_shown.length);
}

function initialiseMenu() {
	//Показуємо усі піци
	API.getPizzaList(function(err, data){
		if(!err){
			Pizza_List=data;
			showPizzaList(data);
			$('#all-pizzas-counter').html(data.length);
		}else{
			console.log(err);
		}
	});
	
}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;
