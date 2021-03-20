/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.cart = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db
            .collection("Users")
            .doc(data.UserUid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if (data.Mode === "ADD_TO_CART") {
                        if (doc.data().Cart.length) {
                            const cart = doc.data().Cart;
                            cart.forEach((item, index) => {
                                if (data.Product.Id === item.Product.Id) {
                                    if (index > -1) {
                                        cart.splice(index, 1);
                                    }
                                }
                            });
                            const cartObjectData = {
                                Product: data.Product,
                                Quantity: data.ProductQuantity,
                            };
                            cart.push(cartObjectData);
                            const p1 = db
                                .collection("Users")
                                .doc(data.UserUid)
                                .update({ Cart: cart });
                            return Promise.resolve(p1);
                        } else {
                            const cart = [];
                            const cartObjectData = {
                                Product: data.Product,
                                Quantity: data.ProductQuantity,
                            };
                            cart.push(cartObjectData);
                            const p2 = db
                                .collection("Users")
                                .doc(data.UserUid)
                                .update({ Cart: cart });
                            return Promise.resolve(p2);
                        }
                    }
                    if (data.Mode === "UPDATE_QUANTITY") {
                        const cart = doc.data().Cart;
                        const index = data.Index;
                        cart[index].Quantity = data.Quantity;
                        const p3 = db
                            .collection("Users")
                            .doc(data.UserUid)
                            .update({ Cart: cart });
                        return Promise.resolve(p3);
                    }
                    if (data.Mode === "DELETE_PRODUCT_FROM_CART") {
                        const cart = doc.data().Cart;
                        const index = data.Index;
                        if (index > -1) {
                            cart.splice(index, 1);
                        }
                        const p4 = db
                            .collection("Users")
                            .doc(data.UserUid)
                            .update({ Cart: cart });
                        return Promise.resolve(p4);
                    }
                }
            });
        Promise.resolve(promise1)
            .then(() => {
                const result = { data: "Added/Deleted Product to Cart Successfully" };
                console.log("Added/Deleted Product to Cart Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Adding/Deleting Product to Cart", error);
                return response.status(500).send(result);
            });
    });
});
