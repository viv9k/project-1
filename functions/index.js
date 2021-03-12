const admin = require("firebase-admin");
admin.initializeApp();

exports.createNewUser = require("./createNewUserAPI").createNewUser;
exports.product = require("./createNewProductAPI").product;
exports.productImage = require("./createNewProductAPI").productImage;