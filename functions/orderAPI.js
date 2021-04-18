/* eslint-disable eol-last */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.order = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (data.Mode === "PLACE_ORDER") {
                const totalNumberofOrders = doc.data().TotalNumberOfOrders + 1;
                const orderId = "O" + totalNumberofOrders;
                const p1 = db.collection("Users").doc(data.UserUid).get().then((docment) => {
                    const contents = docment.data().Cart;
                    const p2 = db.collection("Users").doc(data.UserUid).update({
                        Cart: [],
                    });
                    const p3 = db.collection("Orders").doc(orderId).set({
                        Id: orderId,
                        ProductInfo: contents,
                        UserUid: data.UserUid,
                        TotalNumberOfProducts: contents.length,
                        TotalActualPrice: data.TotalActualPrice,
                        TotalDisountPrice: data.TotalDisountPrice,
                        Date: data.Date,
                        Status: "Ordered",
                    });
                    const p4 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfOrders: totalNumberofOrders,
                    });
                    return Promise.all([p2, p3, p4]);
                });
                return Promise.resolve(p1);
            }
            if (data.Mode === "UPDATE_ORDER") {
                const p5 = db.collection("Orders").doc(data.Id).update({
                    Status: data.Status,
                });
                return Promise.resolve(p5);
            }
        });
        Promise.resolve(promise1)
            .then(() => {
                const result = { data: "Updated Order Details Successfully" };
                console.log("Updated Order Details Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Updating Order", error);
                return response.status(500).send(result);
            });
    });
});
