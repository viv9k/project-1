/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const RazorPay = require("razorpay");
const cors = require("cors")({ origin: true });
require("dotenv").config();

const admin = require("firebase-admin");
const db = admin.firestore();

function generateBase64String(string) {
    return Buffer.from(string).toString("base64");
}

exports.payment = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const Uid = request.body.data.UserUid;

        let amount = 0;

        db.collection("Users").doc(Uid).get().then((doc) => {
            if (doc.exists) {
                const cart = doc.data().Cart;
                cart.forEach((element) => {
                    amount += element.Product.DiscountPrice * element.Quantity * 100;
                });
                const couponCode = doc.data().CheckoutProductDetails.CouponCode;
                console.log(couponCode);
                db.collection("CouponCode").where("Id", "==", couponCode).get().then((docs) => {
                    let discount = 0;
                    docs.forEach((element) => {
                        discount = element.data().Discount;
                    });

                    if (discount != 0) {
                        amount = amount - ((amount * discount) / 100);
                    }

                    const razorpay = new RazorPay({
                        key_id: "rzp_test_bnt0m6RqSlXmhP",
                        key_secret: "NgJb7hmxbLm8HV2TmPxIf9Al",
                    });

                    const options = {
                        amount: amount, // amount in the smallest currency unit
                        currency: "INR",
                        receipt: generateBase64String("string"),
                    };
                    razorpay.orders.create(options, function(err, order) {
                        if (err) {
                            const result = { data: err };
                            console.log(err);
                            return response.status(500).send(result);
                        }

                        db.collection("Users").doc(Uid).update({
                            RazorPayOrderDetails: order,
                        });
                        const result = { data: order };
                        return response.status(200).send(result);
                    });
                });
            }
        });
    });
});
