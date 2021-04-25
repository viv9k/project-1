import { Image } from "./ImageInterface";

export interface Product {
    Name: string;
    Description: string;
    Category: string;
    ActualPrice: number;
    DiscountPrice: number;
    DiscountPercent: number;
    Availability: string;
    Visibility: string;
    Sku: string;
    Stock: number;
    Tag: string;
    Details: { field: string, value: string }[];
    Images: Image[]
}
export interface ProductId extends Product {
    Id: string;
}