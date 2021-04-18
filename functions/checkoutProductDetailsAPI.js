/* eslint-disable eol-last */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.checkoutProductDetails = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("Users").doc(data.UserUid).get().then((doc) => {
            if (data.Mode === "UPDATE_CHECKOUT_PRODUCTS_DETAILS") {
                const CheckoutProductDetailsObj = {
                    CouponCode: data.CouponCode,
                };
                const p1 = db.collection("Users").doc(data.UserUid).update({
                    CheckoutProductDetails: CheckoutProductDetailsObj,
                });
                return Promise.resolve(p1);
            }
        });
        Promise.resolve(promise1)
            .then(() => {
                const result = { data: "Updated Coupan code Successfully" };
                console.log("Updated Coupan code Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Coupan code to Cart", error);
                return response.status(500).send(result);
            });
    });
});
