//import { Country } from "../country.model";

import { DefaultModel } from "./DefaultModel";

export class AddressModel extends DefaultModel {
    address_street?: string | null;
    address_street_number?: string | null;
    address_postal_code?: string | null;
    address_city?: string | null;
    address_country_id?: string | null;
    //address_country?: Country;
}