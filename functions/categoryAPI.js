/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });
const admin = require("firebase-admin");

const db = admin.firestore();

exports.category = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const data = request.body.data;
        console.log(data);
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                let totalNumberOfCategories = doc.data().TotalNumberOfCategories;

                if (data.Mode === "ADD_CATEGORY") {
                    totalNumberOfCategories = totalNumberOfCategories + 1;
                    const categoryId = "C" + totalNumberOfCategories;
                    const p1 = db.collection("Category").doc(categoryId).set({
                        Id: categoryId,
                        Name: data.Name,
                        Position: data.Position,
                    });
                    const p2 = db.collection("RawData").doc("AppDetails").update({
                        TotalNumberOfCategories: totalNumberOfCategories,
                    });
                    return Promise.all([p1, p2]);
                }
                if (data.Mode === "EDIT_CATEGORY") {
                    const p3 = db.collection("Category").doc(data.Id).update({
                        Name: data.Name,
                        Position: data.Position,
                    });
                    return Promise.resolve(p3);
                }
                if (data.Mode === "DELETE_CATEGORY") {
                    const p4 = db.collection("Category").doc(data.Id).delete();
                    return Promise.resolve(p4);
                }
            }
        });
        Promise.resolve(promise1).then(() => {
                const result = { data: "Added/Edited/Deleted Category Successfully" };
                console.log("Added/Edited/Deleted Category Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error in Category API", error);
                return response.status(500).send(result);
            });
    });
});