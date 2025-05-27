import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CONSTANTS_API } from '../constants/api.constants';
import { environment } from '../../../environments/environment';

export const urlPrefixInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        map(response => {
            // Only process HttpResponse objects
            if (response instanceof HttpResponse) {
                // Define the fields to check and modify
                const fieldsToPrefix = CONSTANTS_API.IMAGE_FIELDS;

                // Clone the response body for modification
                let modifiedBody = response.body;

                // If response has a body and it's an object, process it
                if (modifiedBody && typeof modifiedBody === 'object') {
                    modifiedBody = processObject(modifiedBody, fieldsToPrefix);

                    // Return a new response with the modified body
                    return response.clone({ body: modifiedBody });
                }
            }
            return response;
        })
    );
};

/**
 * Recursively processes an object to find and modify specified fields
 */
function processObject(obj: any, fieldsToPrefix: string[]): any {
    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => processObject(item, fieldsToPrefix));
    }

    // Clone the object to avoid mutating the original
    const result = { ...obj };

    // Check each property
    for (const key of Object.keys(result)) {
        if (fieldsToPrefix.includes(key) && typeof result[key] === 'string' && result[key]) {
            // If the field doesn't already start with the API URL, prefix it
            if (!result[key].startsWith(environment.apiUrl) && !result[key].startsWith('http')) {
                let apiUrl = environment.apiUrl;
                if (apiUrl.startsWith('https')) {
                    apiUrl += '/api/public/';
                }
                result[key] = `${apiUrl}${result[key].startsWith('/') ? '' : '/'}${result[key]}`;
            }
        } else if (typeof result[key] === 'object' && result[key] !== null) {
            // Recursively process nested objects and arrays
            result[key] = processObject(result[key], fieldsToPrefix);
        }
    }

    return result;
}
