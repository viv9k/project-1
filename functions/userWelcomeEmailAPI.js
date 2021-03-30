/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
const admin = require("firebase-admin");


const db = admin.firestore();

exports.userWelcomeEmailApi = function(userEmail) {
    const sendEmailPromise = db.collection("mail").add({
        to: userEmail,
        message: {
            subject: "Welcome to vintage home",
            html: "<div style=\"width: 70%; margin: auto;  text-align: center;\"><h1 style=\"color: #5A20F0; font-size: 36px;\">Welcome to Vintage Home</h1><div style=\"color: #000; background-color: #d5d9e6; border: 1px solid; \"><div style=\"padding: 30px;\"><h2 style=\"font-size: 26px;\">" +
                "</h2><p>Keep checking our latest collection.</p></div></div></div>",
        },
    });
    return Promise.resolve(sendEmailPromise).then(() => {
            console.log("Verification Email Sent Successfully!");
            return 0;
        })
        .catch((error) => {
            console.error("Error in Sending Verification Email: ", error);
        });
};