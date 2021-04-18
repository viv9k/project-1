/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
require("dotenv").config();

const crypto = require("crypto");

function hmacSha256(value, secret) {
    return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

exports.paymentVerification = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const orderId = request.body.data.OrderId;
        const paymentId = request.body.data.PaymentId;
        const signature = request.body.data.Signature;

        console.log(orderId);
        console.log(paymentId);
        console.log(signature);

        // const keyId = "rzp_test_bnt0m6RqSlXmhP";
        const keySecret = "NgJb7hmxbLm8HV2TmPxIf9Al";

        const generatedSignature = hmacSha256(orderId + "|" + paymentId, keySecret);

        console.log(generatedSignature);

        if (generatedSignature == signature) {
            const result = { data: "Payment verified successfully" };
            console.log("Payment successful");
            return response.status(200).send(result);
        }

        const result = { data: "Payment Incomplete" };
        return response.status(500).send(result);
    });
});
