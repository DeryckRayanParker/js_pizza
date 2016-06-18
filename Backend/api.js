/**
 * Created by chaika on 09.02.16.
 */
var Pizza_List = require('./data/Pizza_List');
var LIQPAY_PUBLIC_KEY = 'i70785880231';
var LIQPAY_PRIVATE_KEY = 'fWGEciANd2f50nLrq53WsxxG8LB1y4ukRfSuCe9Y';
var crypto = require('crypto');
function sha1(string) {
	var sha1 = crypto.createHash('sha1');
	sha1.update(string);
	return sha1.digest('base64');
}

function base64(str) {
	return new Buffer(str).toString('base64');
}

exports.getPizzaList = function (req, res) {
	res.send(Pizza_List);
};

exports.createOrder = function (req, res) {
	var order_info = req.body;
	console.log("Creating Order", order_info);
	var description = 'Замовлення піци: ' + order_info.name + '\nАдреса доставки: ' + order_info.address + '\nТелефон: ' + order_info.phone + '\nЗамовлення: ';
	order_info.cart.forEach(function (e) {
		description += ('\n ' + e.quantity + 'шт. [' + ((e.size === 'small_size') ? 'Мала' : 'Велика') + '] ' + e.pizza.title);
	});
	description += ('\n\nРазом: ' + order_info.totalPrice + 'грн.');
	var order = {
		version: 3,
		public_key: LIQPAY_PUBLIC_KEY,
		action: "pay",
		amount: order_info.totalPrice,
		currency: "UAH",
		description: description,
		order_id: Math.random(),
		sandbox: 1
	};
	var data = base64(JSON.stringify(order));
	var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);

	res.send({
		success: true,
		data: data,
		signature: signature
	});
};
