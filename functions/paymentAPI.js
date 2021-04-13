/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
require("dotenv").config();
const axios = require('axios');
const sha512 = require('js-sha512');

function generateBase64String(string) {
    return Buffer.from(string).toString("base64");
}

exports.payment = functions.https.onRequest((request, response) => {
    cors(request, response, () => {

        const key = process.env.MERCHANT_KEY;
        const salt = process.env.SALT_KEY;
        const data = request.body.data;
        const mode = process.env.MODE;
        const date = new Date();
        console.log(data);
        const TransactionId = generateBase64String(date.getMilliseconds() + date + data.Firstname);

        const userData = {
            firstname: data.Firstname,
            email: data.Email,
            phone: data.Phone,
            amount: 1000.00,
            productinfo: data.Productinfo,
            txnid: TransactionId, //generate unique transaction Id at server side
            surl: data.SUCCESS_URL,
            furl: data.FAILURE_URL,
        };

        let payUmoneyURL;
        let redirectURL;
        const hashData = {
            hashSequence: key + '|' + data.TransactionId + '|' + data.Amount + '|' + data.Productinfo + '|' + data.Firstname + '|' + data.Email + '|||||||||||' + salt,
        };
        const hash = sha512(hashData.hashSequence);

        const payuData = {
            key: key,
            salt: salt,
            service_provider: 'payu_paisa',
            hash: hash,
        };

        const params = Object.assign(payuData, userData);
        console.log(params);
        if (mode === "TEST") {
            payUmoneyURL = 'https://test.payu.in/_payment';
        }
        if (mode === "PROD") {
            payUmoneyURL = 'https://secure.payu.in/_payment';
        }
        let options = {
            headers: {
                'NoAuth': 'True',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'X-Requested-With,content-type,',
                'Access-Control-Allow-Credentials': 'true',
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json"
            }
        };
        const promise1 = axios
            .post(payUmoneyURL, userData, options)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                console.error(error)
            })
        return Promise.resolve(promise1).then(() => {
                const result = { data: "Pay Link Successfully" };
                console.log("Pay Link In Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Pay Link", error);
                return response.status(500).send(result);
            });
    });
});