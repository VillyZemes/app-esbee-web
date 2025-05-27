import { HttpHeaders } from "@angular/common/http";

export const CONSTANTS_API = {
    HEADERS: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }),
    IMAGE_FIELDS: ['image_path']
}