const admin = require("firebase-admin");
admin.initializeApp();

exports.createNewUser = require("./createNewUserAPI").createNewUser;
exports.product = require("./ProductAPI").product;
exports.cart = require("./cartAPI").cart;