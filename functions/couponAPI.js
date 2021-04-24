/* eslint-disable require-jsdoc */
/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const db = admin.firestore();

exports.coupon = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                let totalNumberOfCoupons = doc.data().TotalNumberOfCoupons;
                if (data.Mode === "CREATE_COUPON") {
                    totalNumberOfCoupons = totalNumberOfCoupons + 1;
                    const couponId = "CC" + totalNumberOfCoupons;
                    const p1 = db.collection("CouponCode").doc(couponId).set({
                        Id: couponId,
                        Code: data.Code,
                        Value: data.Value,
                        Description: data.Description,
                    });
                    const p2 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfCoupons: totalNumberOfCoupons,
                    });
                    return Promise.all([p1, p2]);
                }
                if (data.Mode === "DELETE_COUPON") {
                    totalNumberOfCoupons = totalNumberOfCoupons - 1;
                    const p1 = db.collection("CouponCode").doc(data.CouponId).delete();
                    const p2 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfCoupons: totalNumberOfCoupons,
                    });
                    return Promise.all([p1, p2]);
                }
            }
        });
        Promise.resolve(promise1).then(() => {
                const result = { data: "Added/Deleted Coupon Successfully" };
                console.log("Added/Deleted  Coupon Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error in Coupon API", error);
                return response.status(500).send(result);
            });
    });
});

// /* Generate the base-62 key*/
// const base62 = {
//     charset: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
//         .split(""),
//     encode: (integer) => {
//         if (integer === 0) {
//             return 0;
//         }
//         let s = [];
//         while (integer > 0) {
//             s = [base62.charset[integer % 62], ...s];
//             integer = Math.floor(integer / 62);
//         }
//         return s.join("");
//     },
//     decode: (chars) => chars.split("").reverse().reduce((prev, curr, i) =>
//         prev + (base62.charset.indexOf(curr) * (62 * i)), 0),
// };

// /* Create base-62 based ID with mili second based time*/
// function generateCouponCode() {
//     const dateLocal = new Date();
//     const miliSec = dateLocal.getTime();
//     const couponCode = base62.encode(miliSec);
//     return couponCode;
// }