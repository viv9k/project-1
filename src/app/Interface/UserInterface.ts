import { Cart } from "./CartInterface";
import { Checkout } from "./CheckoutInterface";

export interface User {
    uid: string;
    photoURL: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    providerId: string;
    admin?: boolean;
}

export interface CheckoutProductDetails {
    CouponCode: string;
    TotalActualPrice: number;
    CouponDiscountPercentage: number;
    TotalDisountPriceWithCouponApplied: number;
}

export interface UserCart extends User {
    Cart: Cart[];
    BillingDetails: Checkout;
    CheckoutProductDetails: CheckoutProductDetails;
}