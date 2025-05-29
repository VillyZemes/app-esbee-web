export interface PacketaAddressModel {
    country: string;
    county: string | null;
    city: string;
    region: string | null;
    suburb: string | null;
    street: string;
    state: string | null;
    houseNumber: string;
    postcode: string;
    category: string | null;
    name: string;
    company: string | null;
    latitude: string;
    longitude: string;
}
