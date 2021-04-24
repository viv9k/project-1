/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
// require("dotenv").config();
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const db = admin.firestore();
// const auth = admin.auth();

exports.createNewUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = request.body.data;
        const Uid = user.uid;
        const PhotoURL = user.photoURL;
        const DisplayName = user.displayName;
        const Email = user.email;
        const PhoneNumber = user.phoneNumber;
        const ProviderId = user.providerId;
        let html = `<div style="background-color: #e3e3e3;">
        <div style="padding:40px;">
            <table cellpadding="0" cellspacing="0" style="max-width: 602px;width: 100%;margin: 0 auto;border:1px solid #d5d5d5;border-radius: 9px;">
                <tr style="background-color: #ffffff;padding:0px 20px;text-align: center;">
                    <td style="padding:15px;text-align: center;" valign="middle;color:black;">
                        <h3 style="font-size:25px;font-family: sans-serif;margin:25px 0px 20px">Welcome to Vintage Home</h3>
                        <p>Keep checking our latest collection.</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: center;" valign="top">
                        <table cellpadding="0" cellspacing="0" style="width: 100%;background-color: #ffffff;padding:0px 20px 40px;border: 0;">
                            <tr>
                                <td valign="middle">
                                    <div style="display: block;width:100%;height: 1px;background-color: #d5d5d5;"></div>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:15px;text-align: center;" valign="middle">
                                    <a href="">
                                        <img src="https://vintagehomes-dev.web.app/assets/logo.png" alt="logo">
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td valign="middle" style="text-align: center;">
                                    <p style="font-size:14px;color:#444444;font-family: sans-serif;margin:25px 0px 15px">© Vintage Home | 151 O'Connor Street, Ground floor, Ottawa, ON, K2P 2L8</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>
    </div>`;
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
                const authData = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: "valpasanisandeep@gmail.com", //email of sender
                        pass: "fvkeovfhqswfkehl", //password of sender
                    }
                });
                authData.sendMail({
                    to: Email,
                    subject: 'Welcome to Vintage Home',
                    html: html,
                });
                return Promise.all([userData, authData]);
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
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error LogIn/SignUp User", error);
                return response.status(500).send(result);
            });
    });
});