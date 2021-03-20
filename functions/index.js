/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const admin = require("firebase-admin");
admin.initializeApp();

exports.createNewUser = require("./createNewUserAPI").createNewUser;
exports.product = require("./createNewProductAPI").product;
exports.productImage = require("./createNewProductAPI").productImage;