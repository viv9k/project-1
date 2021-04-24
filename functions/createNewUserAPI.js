/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
// require("dotenv").config();
const admin = require("firebase-admin");

const db = admin.firestore();
// const auth = admin.auth();

const userWelcomeEmailAPI = require("./userWelcomeEmailAPI");

exports.createNewUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = request.body.data;
        const Uid = user.uid;
        const PhotoURL = user.photoURL;
        const DisplayName = user.displayName;
        const Email = user.email;
        const PhoneNumber = user.phoneNumber;
        const ProviderId = user.providerId;
        // if (Email === process.env.ADMIN_EMAIL) {
        //     console.log("Made Admin Successfully");
        //     auth.setCustomUserClaims(Uid, { admin: true });
        // }
        const promise1 = db.collection("Users").doc(Uid).get().then((doc) => {
            if (doc.exists) {
                const userData = db.collection("Users").doc(Uid).update({
                    uid: Uid,
                    photoURL: PhotoURL,
                    displayName: DisplayName,
                    email: Email,
                    phoneNumber: PhoneNumber,
                    providerId: ProviderId,
                });
                return Promise.resolve(userData);
            } else {
                const userData = db.collection("Users").doc(Uid).set({
                    uid: Uid,
                    photoURL: PhotoURL,
                    displayName: DisplayName,
                    email: Email,
                    phoneNumber: PhoneNumber,
                    providerId: ProviderId,
                    admin: false,
                    Cart: [],
                    BillingDetails: {},
                    CheckoutProductDetails: {},
                    RazorPayOrderDetails: {},
                });
                return Promise.resolve(userData);
            }
        });
        const promise2 = db.collection("Users").doc(Uid).get().then((doc) => {
            if (doc.exists) {
                return 0;
            } else {
                const p1 = db.collection("RawData").doc("AppDetails").get().then((docment) => {
                    if (docment.exists) {
                        db.collection("RawData").doc("AppDetails").update({
                            TotalNumberOfUsers: docment.data().TotalNumberOfUsers + 1,
                        });
                    } else {
                        db.collection("RawData").doc("AppDetails").set({
                            TotalNumberOfProducts: 0,
                            TotalNumberOfUsers: 1,
                            TotalNumberOfOrders: 0,
                            TotalNumberOfCategories: 0,
                            TotalNumberOfBanners: 0,
                            TotalNumberOfSideBanners: 0,
                            TotalNumberOfCoupons: 0,
                            TotalNumberOfTags: 0,
                        });
                    }
                });
                return Promise.resolve(p1);
            }
        });
        const Promises = [promise1, promise2];
        return Promise.all(Promises).then(() => {
                const result = { data: "User Logged In Successfully" };
                console.log("User Logged In Successfully");
                userWelcomeEmailAPI.userWelcomeEmailApi(Email);
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error LogIn/SignUp User", error);
                return response.status(500).send(result);
            });
    });
});
