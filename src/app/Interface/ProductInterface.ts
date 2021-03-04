export interface Product {
    Name: string;
    Description: string;
    ImageURL: string;
    ActualPrice: Number;
    DiscountPrice: Number;
    Availability: string;
}
export interface ProductId extends Product {
    Id: string;
}