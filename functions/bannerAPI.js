/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
require("dotenv").config();
const admin = require("firebase-admin");

const db = admin.firestore();

exports.banner = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                let totalNumberOfBanners = doc.data().TotalNumberOfBanners;

                if (data.Mode === "CREATE_BANNER_IMAGE") {
                    totalNumberOfBanners = totalNumberOfBanners + 1;
                    const bannerId = "B" + totalNumberOfBanners;
                    const p1 = db.collection("Banner").doc(bannerId).set({
                        Id: bannerId,
                        DownloadURL: data.DownloadURL,
                        Path: data.Path,
                        UploadTime: data.UploadTime,
                        Link: "",
                        Description: "",
                    });
                    const p2 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfBanners: totalNumberOfBanners,
                    });
                    return Promise.all([p1, p2]);
                }
                if (data.Mode === "DELETE_BANNER_IMAGE") {
                    const p3 = db.collection("Banner").doc(data.BannerId).delete();
                    return Promise.resolve(p3);
                }
                if (data.Mode === "UPDATE_LINK_DESCRIPTION") {
                    const p4 = db.collection("Banner").doc(data.BannerId).update({
                        Link: data.Link,
                        Description: data.Description,
                    });
                    return Promise.resolve(p4);
                }
            }
        });
        Promise.resolve(promise1).then(() => {
                const result = { data: "Added/Deleted Banner Image Successfully" };
                console.log("Added/Deleted Banner Image Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error in Banner API", error);
                return response.status(500).send(result);
            });
    });
});