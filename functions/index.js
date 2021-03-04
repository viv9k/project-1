const admin = require("firebase-admin");
admin.initializeApp();

exports.createNewUser = require("./createNewUserAPI").createNewUser;
exports.createNewProduct = require("./createNewProductAPI").createNewProduct;