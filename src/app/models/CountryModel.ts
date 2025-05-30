import { DefaultModel } from "../shared/models/DefaultModel";

export interface CountryModel extends DefaultModel {
    name: string;
    iso2: string;       // 2-character ISO code (e.g., "SK")
    iso3: string;       // 3-character ISO code (e.g., "SVK")
    phone_code: string; // e.g., "+421"
    icon?: string;      // optional emoji or icon (e.g., "🇸🇰")
    is_active: boolean;
}
