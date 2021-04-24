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

exports.paymentVerification = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const orderId = request.body.data.OrderId;
        const paymentId = request.body.data.PaymentId;
        const signature = request.body.data.Signature;

        console.log(orderId);
        console.log(paymentId);

        const keySecret = process.env.SECRET || `${functions.config().razorpay.secret}`;
        let generatedSignature = "";

        generatedSignature = crypto.createHmac("sha256", keySecret).update((orderId + "|" + paymentId).toString()).digest("hex");
        console.log(generatedSignature);

        if (generatedSignature === signature) {
            const result = { data: "Payment verified successfully", status: 200 };
            console.log("Payment successful");
            return response.status(200).send(result);
        } else {
            const result = { data: "Payment Incomplete" };
            return response.status(500).send(result);
        }
    });
});