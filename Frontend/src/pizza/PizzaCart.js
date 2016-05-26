/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var basil = require('basil.js');
basil = new basil();

//Перелік розмірів піци
var PizzaSize = {
	Big: "big_size",
	Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
	//Додавання однієї піци в кошик покупок
	item = {
		pizza: pizza,
		size: size,
		quantity: 1
	};
	
	if(Cart.filter(function(e) { return e.pizza.title === pizza.title && e.size===size;}).length>0){
		Cart.filter(function(e) { return e.pizza.title === pizza.title && e.size===size;})[0].quantity+=1;
	}
	else{
	//Приклад реалізації, можна робити будь-яким іншим способом
	Cart.push(item);
	}

	//Оновити вміст кошика на сторінці
	updateCart();
}

function removeFromCart(cart_item) {
	//Видалити піцу з кошика
	//TODO: треба зробити
	Cart.splice(Cart.indexOf(cart_item), 1);
	basil.set('cart', Cart);
	//Після видалення оновити відображення
	updateCart();
}

function removeAll() {
	Cart = [];
	basil.set('cart', Cart);
	updateCart();
}

function initialiseCart() {
	//Фукнція віпрацьвуватиме при завантаженні сторінки
	//Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
	//TODO: ...
	var saved_pizzas = basil.get('cart');
	if (saved_pizzas) {
		Cart = saved_pizzas;
	}
	updateCart();
}

function getPizzaInCart() {
	//Повертає піци які зберігаються в кошику
	return Cart;
}

function updateCart() {
	//Функція викликається при зміні вмісту кошика
	//Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

	//Очищаємо старі піци в кошику
	$cart.html("");

	//Онволення однієї піци
	function showOnePizzaInCart(cart_item) {
		var html_code = Templates.PizzaCart_OneItem(cart_item);

		var $node = $(html_code);

		$node.find(".plus").click(function () {
			//Збільшуємо кількість замовлених піц
			cart_item.quantity += 1;
			//Оновлюємо відображення
			updateCart();
		});
		$node.find(".minus").click(function () {
			if (cart_item.quantity > 1) {
				cart_item.quantity -= 1;
			} else {
				$node.find('.rm-btn').click();
			}
			updateCart();
		});

		$node.find('.rm-btn').click(function () {
			removeFromCart(cart_item);
		});

		$cart.append($node);
	}

	$('#order-counter').html(Cart.length);
	Cart.forEach(showOnePizzaInCart);
	if (Cart.length === 0) {
		$cart.append('<div id="gag-message">Порожньо в холодильнику?						<br/> Замовте піцу!</div>');
	}
	//save to local storage
	basil.set('cart', Cart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.removeAll = removeAll;
