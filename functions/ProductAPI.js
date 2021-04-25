/* eslint-disable object-curly-spacing */
/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */

const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");

const db = admin.firestore();

exports.product = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        const product = request.body.data;
        const promises = [];
        const promise1 = db.collection("RawData").doc("AppDetails").get().then((doc) => {
            if (doc.exists) {
                const totalNumberOfOrders = doc.data().TotalNumberOfOrders;
                const totalNumberOfUsers = doc.data().TotalNumberOfUsers;
                let totalNumberOfProducts = doc.data().TotalNumberOfProducts;
                if (product.Mode === "CREATE_PRODUCT") {
                    totalNumberOfProducts = totalNumberOfProducts + 1;
                    const productId = "P" + totalNumberOfProducts;
                    const p1 = db.collection("Products").doc(productId).update({
                        Id: productId,
                        Name: product.Name,
                        Description: product.Description,
                        Category: product.Category,
                        ActualPrice: product.ActualPrice,
                        DiscountPrice: parseFloat(product.DiscountPrice.toFixed(2)),
                        DiscountPercent: product.DiscountPercent,
                        Availability: product.Availability,
                        Visibility: product.Visibility,
                        Tag: product.Tag,
                        Sku: product.Sku,
                        Stock: product.Stock,
                        Details: product.Details,
                    });
                    promises.push(p1);
                } else if (product.Mode === "CREATE_PRODUCT_IMAGE") {
                    const ProductImage = request.body.data;
                    const ImageObjectData = {
                        DownloadURL: ProductImage.DownloadURL,
                        Path: ProductImage.Path,
                    };
                    const p1 = db.collection("Products").doc(ProductImage.ProductId).get().then((doc) => {
                        if (doc.exists) {
                            const ImageArray = doc.data().Images;
                            ImageArray.push(ImageObjectData);
                            const promise1 = db.collection("Products").doc(ProductImage.ProductId).update({
                                Images: ImageArray,
                            });
                            return Promise.resolve(promise1);
                        } else {
                            const ImageArray = [];
                            ImageArray.push(ImageObjectData);
                            const promise1 = db.collection("Products").doc(product.ProductId).set({
                                Images: ImageArray,
                            });
                            return Promise.resolve(promise1);
                        }
                    });
                    promises.push(p1);
                } else if (product.Mode === "DELETE_PRODUCT_IMAGE") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then((doc) => {
                        const ProductImage = request.body.data;
                        const ImageObjectData = {
                            DownloadURL: ProductImage.DownloadURL,
                            Path: ProductImage.Path,
                        };
                        if (doc.exists) {
                            const ImageArray = doc.data().Images;
                            const index = ProductImage.ImageIndex;
                            if (index > -1) {
                                ImageArray.splice(index, 1);
                            }
                            const p1 = db.collection("Products").doc(ProductImage.ProductId).update({
                                Images: ImageArray,
                            });
                            promises.push(p1);
                        } else {
                            const ImageArray = [];
                            ImageArray.push(ImageObjectData);
                            db.collection("Products").doc(product.ProductId).set({
                                Images: ImageArray,
                            });
                        }
                    });
                    promises.push(p1);
                } else if (product.Mode === "UPDATE_PRODUCT") {
                    const p1 = db.collection("Products").doc(product.ProductId).update({
                        Name: product.Name,
                        Description: product.Description,
                        Category: product.Category,
                        ActualPrice: product.ActualPrice,
                        DiscountPrice: product.DiscountPrice,
                        Availability: product.Availability,
                        Visibility: product.Visibility,
                        DiscountPercent: product.DiscountPercent,
                        Sku: product.Sku,
                        Stock: product.Stock,
                        Tag: product.Tag,
                    });
                    promises.push(p1);
                } else if (product.Mode === "UPDATE_PRODUCT_CATEGORY") {
                    const p1 = db.collection("Products").doc(product.ProductId).update({
                        Category: product.Category,
                    });
                    promises.push(p1);
                } else if (product.Mode === "UPDATE_PRODUCT_TAG") {
                    const p1 = db.collection("Products").doc(product.ProductId).update({
                        Tag: product.Tag,
                    });
                    promises.push(p1);
                } else if (product.Mode === "ADD_FIELD") {
                    const p1 = db.collection("Products").doc(product.ProductId).get().then((doc) => {
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
                    const p1 = db.collection("Products").doc(product.ProductId).get().then((doc) => {
                        if (doc.exists) {
                            const details = doc.data().Details;
                            const index = product.ObjectIndex;
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
                        snapshot.forEach((doc) => {
                            doc.ref.delete();
                        });
                    });
                    promises.push(p3);
                }
                const p2 = db.collection("RawData").doc("AppDetails").update({
                    TotalNumberOfOrders: totalNumberOfOrders,
                    TotalNumberOfUsers: totalNumberOfUsers,
                    TotalNumberOfProducts: totalNumberOfProducts,
                });
                promises.push(p2);
            }
            return Promise.all(promises);
        });
        Promise.resolve(promise1)
            .then(() => {
                const result = { data: "Product Created/Modified Successfully" };
                console.log("Product Created/Modified Successfully");
                return response.status(200).send(result);
            })
            .catch((error) => {
                const result = { data: error };
                console.error("Error Creating/Modifying Product", error);
                return response.status(500).send(result);
            });
    });
});
