const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");
const e = require("cors");

const db = admin.firestore();

exports.checkout = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("Users").doc(data.UserUid).get().then((doc) => {
            if (doc.exists) {
                if (data.Mode === "UPDATE_BILLING_DETAILS") {
                    let BillingDetailObject = {
                        UserName: data.UserName,
                        MobileNumber: data.MobileNumber,
                        Pincode: data.Pincode,
                        Address: data.Address,
                        City: data.City,
                        State: data.State,
                        Country: "India",
                    }
                    const p1 = db.collection("Users").doc(data.UserUid).update({
                        BillingDetails: BillingDetailObject
                    });
                    return Promise.resolve(p1);
                }
                if (data.Mode === "PLACE_ORDER") {
                    if (!doc.data().Orders.length) {
                        let orders = [];
                        orders.push(doc.data().cart)
                    } else {
                        //To Be Done
                    }
                    let cart = doc.data().Cart;
                }
            }
        });
        Promise.resolve(promise1)
            .then(() => {
                const result = { data: "Updated Billing Details Successfully" };
                console.log("Updated Billing Details Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Adding/Deleting Product to Cart", error);
                return response.status(500).send(result);
            });
    });
});