/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const db = admin.firestore();

exports.tag = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                let totalNumberOfTags = doc.data().TotalNumberOfTags;
                if (data.Mode === "CREATE_TAG") {
                    totalNumberOfTags = totalNumberOfTags + 1;
                    const tagId = "T" + totalNumberOfTags;
                    const p1 = db.collection("Tag").doc(tagId).set({
                        Id: tagId,
                        Name: data.Name,
                        UploadTime: data.UploadTime,
                    });
                    const p2 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfTags: totalNumberOfTags,
                    });
                    return Promise.all([p1, p2]);
                }
                if (data.Mode === "UPDATE_TAG") {
                    const p1 = db.collection("Tag").doc(data.TagId).update({
                        Name: data.Name,
                    });

                    return Promise.resolve(p1);
                }
                if (data.Mode === "DELETE_TAG") {
                    totalNumberOfTags = totalNumberOfTags - 1;
                    const p1 = db.collection("Tag").doc(data.TagId).delete();
                    const p2 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfTags: totalNumberOfTags,
                    });
                    return Promise.all([p1, p2]);
                }
            }
        });
        Promise.resolve(promise1).then(() => {
                const result = { data: "Added/Updated/Deleted Tag Successfully" };
                console.log("Added/Updated/Deleted Tag Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error in Tag API", error);
                return response.status(500).send(result);
            });
    });
});