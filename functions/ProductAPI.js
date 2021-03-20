const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.product = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        let product = request.body.data;
        let promises = [];
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                let totalNumberOfOrders = doc.data().TotalNumberOfOrders;
                let totalNumberOfUsers = doc.data().TotalNumberOfUsers;
                let totalNumberOfProducts = doc.data().TotalNumberOfProducts;
                if (product.Mode === "CREATE_PRODUCT") {
                    totalNumberOfProducts = totalNumberOfProducts + 1;
                    let productId = "P" + totalNumberOfProducts;
                    const p1 = db.collection("Products").doc(productId).update({
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
                        Details: product.Details
                    });
                    promises.push(p1);
                } else if (product.Mode === "CREATE_PRODUCT_IMAGE") {
                    let ProductImage = request.body.data;
                    let ImageObjectData = {
                        DownloadURL: ProductImage.DownloadURL,
                        Path: ProductImage.Path,
                    }
                    const p1 = db.collection("Products").doc(ProductImage.ProductId).get().then((doc) => {
                        if (doc.exists) {
                            let ImageArray = doc.data().Images;
                            ImageArray.push(ImageObjectData);
                            const promise1 = db.collection("Products").doc(ProductImage.ProductId).update({
                                Images: ImageArray,
                            });
                            return Promise.resolve(promise1);
                        } else {
                            let ImageArray = []
                            ImageArray.push(ImageObjectData);
                            const promise1 = db.collection("Products").doc(product.ProductId).set({
                                Images: ImageArray,
                            });
                            return Promise.resolve(promise1);
                        }
                    })
                    promises.push(p1);
                } else if (product.Mode === "DELETE_PRODUCT_IMAGE") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then((doc) => {
                        let ProductImage = request.body.data;
                        if (doc.exists) {
                            let ImageArray = doc.data().Images;
                            let index = ProductImage.ImageIndex;
                            if (index > -1) {
                                ImageArray.splice(index, 1);
                            }
                            const p1 = db.collection("Products").doc(ProductImage.ProductId).update({
                                Images: ImageArray,
                            });
                            promises.push(p1);
                        } else {
                            let ImageArray = []
                            ImageArray.push(ImageObjectData);
                            db.collection("Products").doc(product.ProductId).set({
                                Images: ImageArray,
                            })
                        }
                    })
                } else if (product.Mode === "UPDATE_PRODUCT") {
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
                    });
                    promises.push(p1);
                } else if (product.Mode === "ADD_TAG") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then(doc => {
                        if (doc.exists) {
                            let allTags = doc.data().Tags;
                            allTags.push(product.NewTag);
                            const promise1 = db.collection("Products").doc(product.ProductId).update({
                                Tags: allTags,
                            });
                            return Promise.resolve(promise1);
                        }
                    });
                    promises.push(p1);
                } else if (product.Mode === "DELETE_TAG") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then(doc => {
                        if (doc.exists) {
                            let tags = doc.data().Tags;
                            let index = product.TagIndex;
                            if (index > -1) {
                                tags.splice(index, 1);
                            }
                            const promise1 = db.collection("Products").doc(product.ProductId).update({
                                Tags: tags,
                            });
                            return Promise.resolve(promise1);
                        }
                    });
                    promises.push(p1);
                } else if (product.Mode === "ADD_FIELD") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then(doc => {
                        if (doc.exists) {
                            const details = doc.data().Details;
                            details.push(product.NewObject);
                            const promise1 = db.collection("Products").doc(product.ProductId).update({
                                Details: details,
                            });
                            return Promise.resolve(promise1);
                        }
                    });
                    promises.push(p1);
                } else if (product.Mode === "DELETE_FIELD") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then(doc => {
                        if (doc.exists) {
                            const details = doc.data().Details;
                            let index = product.ObjectIndex;
                            if (index > -1) {
                                details.splice(index, 1);
                            }
                            const promise1 = db.collection("Products").doc(product.ProductId).update({
                                Details: details,
                            });
                            return Promise.resolve(promise1);
                        }
                    });
                    promises.push(p1);
                } else if (product.Mode === "DELETE_PRODUCT") {
                    totalNumberOfProducts = totalNumberOfProducts - 1;
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