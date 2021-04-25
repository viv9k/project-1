/* eslint-disable eol-last */
/* eslint-disable object-curly-spacing */
/* eslint-disable indent */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.checkout = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("Users").doc(data.UserUid).get().then((doc) => {
            if (data.Mode === "UPDATE_BILLING_DETAILS") {
                const BillingDetailObject = {
                    UserName: data.UserName,
                    MobileNumber: data.MobileNumber,
                    Pincode: data.Pincode,
                    Address: data.Address,
                    City: data.City,
                    State: data.State,
                    Country: "India",
                    CouponDiscountPercentage: data.CouponDiscountPercentage,
                    TotalDisountPriceWithCouponApplied: data.TotalDisountPriceWithCouponApplied,
                };
                const p1 = db.collection("Users").doc(data.UserUid).update({
                    BillingDetails: BillingDetailObject,
                });
                return Promise.resolve(p1);
            }
            if (data.Mode === "PLACE_ORDER") {
                const p2 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
                    const totalNumberofOrders = doc.data().TotalNumberOfOrders + 1;
                    const orderId = "O" + totalNumberofOrders;
                    const p3 = db.collection("Users").doc(data.UserUid).get().then((doc) => {
                        const contents = doc.data().Cart;
                        const p4 = db.collection("Users").doc(data.UserUid).update({
                            Cart: [],
                        });
                        const p5 = db.collection("Orders").doc(orderId).set({
                            Id: orderId,
                            ProductInfo: contents,
                            UserUid: data.UserUid,
                            TotalNumberOfProducts: contents.length,
                            TotalActualPrice: data.TotalActualPrice,
                            TotalDisountPrice: data.TotalDisountPrice,
                            Date: data.Date,
                            Status: "Ordered",
                        });
                        const p6 = db.collection("RawData").doc("AppDetails").update({
                            TotalNumberOfOrders: totalNumberofOrders,
                        });
                        return Promise.all([p4, p5, p6]);
                    });
                    return Promise.resolve(p3);
                });
                return Promise.resolve(p2);
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
