const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.product = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        let totalNumberOfOrders;
        let totalNumberOfUsers;
        let totalNumberOfProducts;
        let productId = "";
        let product = request.body.data;
        console.log(product);
        let promises = [];
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                if (product.Mode === "CREATE") {
                    totalNumberOfOrders = doc.data().TotalNumberOfOrders;
                    totalNumberOfUsers = doc.data().TotalNumberOfUsers;
                    totalNumberOfProducts = doc.data().TotalNumberOfProducts + 1;
                    productId = "P" + totalNumberOfProducts;
                    const p1 = db.collection("Products").doc(productId).set({
                        Id: productId,
                        Name: product.Name,
                        Description: product.Description,
                        ActualPrice: product.ActualPrice,
                        DiscountPrice: product.DiscountPrice,
                        DiscountPercent: product.DiscountPercent,
                        Availability: product.Availability,
                        Visibility: product.Visibility,
                        Tags: product.Tags,
                        Sku: product.Sku,
                        Stock: product.Stock,
                    });
                    promises.push(p1);
                } else if (product.Mode === "UPDATE") {
                    totalNumberOfOrders = doc.data().TotalNumberOfOrders;
                    totalNumberOfUsers = doc.data().TotalNumberOfUsers;
                    totalNumberOfProducts = doc.data().TotalNumberOfProducts;
                    const p1 = db.collection("Products").doc(product.ProductId).update({
                        Name: product.Name,
                        Description: product.Description,
                        ActualPrice: product.ActualPrice,
                        DiscountPrice: product.DiscountPrice,
                        Availability: product.Availability,
                        Visibility: product.Visibility,
                        DiscountPercent: product.DiscountPercent,
                        Sku: product.Sku,
                        Stock: product.Stock,
                        Tags: product.Tags,
                    });
                    promises.push(p1);
                } else if (product.Mode === "DELETE") {
                    totalNumberOfOrders = doc.data().TotalNumberOfOrders;
                    totalNumberOfUsers = doc.data().TotalNumberOfUsers;
                    totalNumberOfProducts = doc.data().TotalNumberOfProducts - 1;
                    const p1 = db.collection("Products").doc(product.ProductId).delete();
                    promises.push(p1);
                    const p3 = db.collection("Products").doc(product.ProductId).collection("Images").where("ProductId", "==", product.ProductId).get().then((snapshot) => {
                        snapshot.forEach(doc => {
                            doc.ref.delete();
                        })
                    })
                    promises.push(p3);
                }
                const p2 = db.collection("RawData").doc("AppDetails").update({
                    TotalNumberOfOrders: totalNumberOfOrders,
                    TotalNumberOfUsers: totalNumberOfUsers,
                    TotalNumberOfProducts: totalNumberOfProducts
                });
                promises.push(p2);
            }
            return Promise.all(promises);
        });
        Promise.resolve(promise1)
            .then(() => {
                result = { data: "Product Created/Modified Successfully" };
                console.log("Product Created/Modified Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                result = { data: error };
                console.error("Error Creating/Modifying Product", error);
                return response.status(500).send(result);
            });
    })
});

exports.productImage = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        let ImageData = request.body.data;
        console.log(ImageData);
        let promises = [];
        const promise1 = db.collection("Products").doc(ImageData.ProductId).collection("Images").doc(ImageData.Id).get().then((doc) => {
            if (doc.exists) {
                if (ImageData.Mode === "DELETE") {
                    const p1 = db.collection("Products").doc(ImageData.ProductId).collection("Images").doc(ImageData.Id).delete();
                    promises.push(p1);
                }
            } else {
                if (ImageData.Mode === "CREATE") {
                    const p1 = db.collection("Products").doc(ImageData.ProductId).collection("Images").doc(ImageData.Id).set({
                        Id: ImageData.Id,
                        DownloadURL: ImageData.DownloadURL,
                        Path: ImageData.Path,
                        ProductId: ImageData.ProductId
                    });
                    promises.push(p1);
                }
            }
            return Promise.all(promises);
        });
        Promise.resolve(promise1)
            .then(() => {
                result = { data: "Product Images Created/Deleted Successfully" };
                console.log("Product Images Created/Deleted Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                result = { data: error };
                console.error("Error Creating/Deleting Product Images", error);
                return response.status(500).send(result);
            });
    })
});