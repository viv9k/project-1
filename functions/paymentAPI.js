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

        db.collection("Users").doc(Uid).get().then((doc) => {
            if (doc.exists) {
                const amount = doc.data().CheckoutProductDetails.TotalDisountPriceWithCouponApplied;

                const razorpay = new RazorPay({
                    key_id: "rzp_test_wGS2ZWj8mzB0bd",
                    key_secret: "cyPEJaEZtgm4qXdEVPzlmDWK",
                });

                const options = {
                    amount: amount * 100, // amount in the smallest currency unit
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
            }
        });
    });
});