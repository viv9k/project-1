import { Image } from "./ImageInterface";

export interface Banner extends Image {
    Id: string;
    UploadTime: number;
    Link: string;
    Description: string;
}