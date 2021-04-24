/* eslint-disable eol-last */
/* eslint-disable indent */
/* eslint-disable max-len */
const admin = require("firebase-admin");
const db = admin.firestore();

exports.orderStatusEmailApi = function(docment, contents, data) {
        const emailContent = `<div style="background-color: #e3e3e3">
    <div style="padding: 30px;">
        <table cellpadding="0" cellspacing="0" style="max-width: 400px;width: 100%;border:2px solid #d5d5d5;background-color: #ffffff;border-radius: 9px;margin: 0 auto;padding: 20px;">
            <tr id="orderInfo">
                <td style="text-align: center;">
                    <h3 style="font-size:25px;font-family: sans-serif;color:#444444;">Order Information</h3>
                    <p style="color:#444444;">${docment.data().BillingDetails.UserName} placed order #${data.OrderId} on ${data.Date}.</p>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:auto;width: 100%;">
                    <div style="display: block;width:100%;height: 1px;background-color: #d5d5d5;margin-bottom: 5px;"></div>
                </td>
            </tr>
            <tr>
                <td style="text-align: center;">
                    <h3 style="font-size:25px;font-family: sans-serif;margin:5px 0px 10px;color:#444444;">Summary</h3>
                </td>
            </tr>
            ${contents.map((item) => `<tr style="display: flex;justify-content: center;align-items: center;">
                            <td style="display: inline-block;max-width:70px;width: 100%;text-align: center">
                                <img src=${item.Product.Images[0].DownloadURL} style="max-width: 108px;width: 100%;border:1px solid #d5d5d5">
                            </td>
                            <td style="display: inline-block;max-width:20px;width: 100%">
                                &nbsp;
                            </td>
                            <td style="display: inline-block;max-width:270px;width: 100%;text-align: center">
                                <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">${item.Product.Name}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="display: inline-block;max-width:200px;width: 100%;">
                                <p style="margin:0;font-size:16px;color:#444444;">&#8377; ${item.Product.DiscountPrice} × ${item.Quantity}</p>
                            </td>
                            <td style="display: inline-block;max-width:150px;width: 100%;text-align: end;">
                                <p style="margin:0;font-size:16px;color:#444444;">&#8377; ${item.Product.DiscountPrice * item.Quantity}</p>
                            </td>
                        </tr>
                          <tr>
                <td style="display: inline-block;max-width:auto;width: 100%;">
                    <div style="display: block;width:100%;height: 1px;background-color: #d5d5d5;margin-bottom: 2px;"></div>
                </td>
            </tr>`)}
            <tr>
                <td style="display: inline-block;max-width:auto;width: 100%;margin-top: 10px;">
                    <div style="display: block;width:100%;height: 1px;background-color: #d5d5d5;margin-bottom: 20px;"></div>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:200px;width: 100%;">
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">Subtotal</p>
                </td>
                <td style="display: inline-block;max-width:150px;width: 100%;text-align: end;">
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">&#8377; ${docment.data().CheckoutProductDetails.TotalActualPrice}</p>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:200px;width: 100%;">
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">Discount</p>
                </td>
                <td style="display: inline-block;max-width:150px;width: 100%;text-align: end;">
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">- &#8377; ${docment.data().CheckoutProductDetails.TotalActualPrice - docment.data().CheckoutProductDetails.TotalDisountPrice}</p>
                </td>
            </tr>
            ${docment.data().CheckoutProductDetails.CouponDiscountPercentage > 0 ? `<tr>
                        <td style="display: inline-block;max-width:200px;width: 100%;">
                            <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">Coupon Discount</p>
                        </td>
                        <td style="display: inline-block;max-width:150px;width: 100%;text-align: end;">
                            <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">- &#8377; ${docment.data().CheckoutProductDetails.TotalDisountPrice - docment.data().CheckoutProductDetails.TotalDisountPriceWithCouponApplied}</p>
                        </td>
                    </tr>` : `<tr>
                    <td style="display: inline-block;max-width:200px;width: 100%;">
                        <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">Coupon Discount</p>
                    </td>
                    <td style="display: inline-block;max-width:150px;width: 100%;text-align: end;">
                        <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px">- &#8377; 0</p>
                    </td>
                </tr>`
                    }
            <tr>
                <td style="display: inline-block;max-width:200px;width: 100%;">
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px;font-weight: bold;">Total</p>
                </td>
                <td style="display: inline-block;max-width:150px;width: 100%;text-align: end;">
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px;font-weight: bold;">&#8377; ${docment.data().CheckoutProductDetails.TotalDisountPriceWithCouponApplied}</p>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:auto;width: 100%;">
                    <div style="display: block;width:100%;height: 1px;background-color: #d5d5d5;margin-bottom: 20px;"></div>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:270px;width: 100%;">
                    <p style="margin:0;font-size:16px;color:#444444;font-weight: bold;">Payment processing method</p>
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px;">RazorPay</p>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:270px;width: 100%;">
                    <p style="margin:0;font-size:16px;color:#444444; font-weight: bold;">Delivery method </p>
                    <p style="margin:0;font-size:16px;color:#444444; margin-bottom:20px;">Standard</p>
                </td>
            </tr>
            <tr>
                <td style="display: inline-block;max-width:500px;width: 100%;">
                    <p style="margin:0;font-size:16px;color:#444444; font-weight: bold;">Shipping address</p>
                    <p style="margin:0;font-size:16px;color:#444444; ">${docment.data().BillingDetails.UserName}</p>
                    <p style="margin:0;font-size:16px;color:#444444; ">${docment.data().BillingDetails.Address}</p>
                    <p style="margin:0;font-size:16px;color:#444444; ">${docment.data().BillingDetails.City}, ${docment.data().BillingDetails.State} ${docment.data().BillingDetails.Pincode} </p>
                    <p style="margin:0;font-size:16px;color:#444444; ">${docment.data().BillingDetails.Country} </p>
                    <p style="margin:0;font-size:16px;color:#444444; "> ${docment.data().BillingDetails.MobileNumber} </p>
                </td>
            </tr>
            <tr>
                <td style="text-align: center;" valign="top">
                    <table cellpadding="0" cellspacing="0" style="width: 100%;background-color: #ffffff;padding:0px 20px 40px;border: 0;">
                        <tr>
                            <td>
                                <div style="display: block;width:100%;height: 1px;background-color: #d5d5d5;"></div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:15px;text-align: center;">
                                <img src="https://vintagehomes-dev.web.app/assets/logo.png" alt="logo">
                            </td>
                        </tr>
                        <tr style="text-align: center;">
                            <td>
                                <p style="font-size:14px;color:#444444;font-family: sans-serif;">© Vintage Home | 151 O'Connor Street, Ground floor, Ottawa, ON, K2P 2L8</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div >
</div > `;
    const sendEmailPromise = db.collection("mail").add({
        to: docment.data().email,
        message: {
            subject: "Order Placed Successfully",
            html: emailContent,
        },
    });
    return Promise.resolve(sendEmailPromise).then(() => {
            console.log("Order Email Sent Successfully!");
            return 0;
        })
        .catch((error) => {
            console.error("Error in Sending Verification Email: ", error);
        });
};