import { Cart } from "./CartInterface";

export interface User {
    uid: string;
    photoURL: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    providerId: string;
    admin?: boolean;
}

export interface UserCart extends User {
    Cart: Cart[];
}