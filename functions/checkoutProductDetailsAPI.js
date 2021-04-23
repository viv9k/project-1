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
                const couponCode = data.CouponCode;
                let totalDisountPrice = 0;
                let totalDisountPriceWithCouponApplied = 0;
                let totalActualPrice = 0;
                let couponDiscount = 0;
                doc.data().Cart.map((item) => {
                    totalDisountPrice += item.Product.DiscountPrice * item.Quantity;
                    totalActualPrice += item.Product.ActualPrice * item.Quantity;
                });
                const p1 = db.collection("CouponCode").where("Code", "==", couponCode).get().then((docs) => {
                    docs.forEach((element) => {
                        couponDiscount = element.data().Value;
                    });
                    if (couponDiscount > 0) {
                        totalDisountPriceWithCouponApplied = totalDisountPrice - (totalDisountPrice * couponDiscount / 100);
                    } else {
                        totalDisountPriceWithCouponApplied = totalDisountPrice;
                    }
                    const CheckoutProductDetailsObj = {
                        CouponCode: couponCode,
                        CouponDiscountPercentage: couponDiscount,
                        TotalDisountPriceWithCouponApplied: totalDisountPriceWithCouponApplied,
                        TotalActualPrice: totalActualPrice,
                    };
                    const p2 = db.collection("Users").doc(data.UserUid).update({
                        CheckoutProductDetails: CheckoutProductDetailsObj,
                    });
                    return Promise.resolve(p2);
                });
                return Promise.resolve(p1);
            }
        });
        Promise.resolve(promise1)
            .then(() => {
                const result = { data: "Updated Coupon code Successfully" };
                console.log("Updated Coupon code Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Coupon code to Cart", error);
                return response.status(500).send(result);
            });
    });
});