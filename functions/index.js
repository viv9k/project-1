/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const admin = require("firebase-admin");
admin.initializeApp();

exports.createNewUser = require("./createNewUserAPI").createNewUser;
exports.product = require("./ProductAPI").product;
exports.cart = require("./cartAPI").cart;
exports.checkout = require("./checkoutAPI").checkout;
exports.category = require("./categoryAPI").category;
exports.banner = require("./bannerAPI").banner;
exports.order = require("./orderAPI").order;
exports.payment = require("./paymentAPI").payment;
