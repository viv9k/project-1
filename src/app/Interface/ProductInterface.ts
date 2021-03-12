export interface Product {
    Name: string;
    Description: string;
    ActualPrice: number;
    DiscountPrice: number;
    DiscountPercent: number;
    Availability: string;
    Visibility: string;
    Sku: string;
    Stock: number;
    Tags: string[];
}
export interface ProductId extends Product {
    Id: string;
}