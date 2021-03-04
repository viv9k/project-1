const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.createNewUser = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const user = request.body.data;
        const Uid = user.uid;
        const PhotoURL = user.photoURL;
        const DisplayName = user.displayName;
        const Email = user.email;
        const PhoneNumber = user.phoneNumber;
        const ProviderId = user.providerId;

        console.log(user);
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
                    admin: false
                });
                return Promise.resolve(userData);
            }
        });
        const promise2 = db.collection("Users").doc(Uid).get().then(doc => {
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
                        });
                    }
                })
                return Promise.resolve(p1);
            }
        })
        const Promises = [promise1, promise2];
        let result;
        return Promise.all(Promises).then(() => {
                result = { data: "User Logged In Successfully" };
                console.log("User Logged In Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                result = { data: error };
                console.error("Error LogIn/SignUp User", error);
                return response.status(500).send(result);
            });
    });
});