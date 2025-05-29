export interface PacketaOptionsModel {
    packetaPickupOptions?: {
        country?: string,
        language?: string,
        valueFormat?: string,
        view?: string,
    };
    packetaAddressOptions?: {
        layout: string,
        carrierId: string,
        country: string,
        language: string,
        centerCountry: string,
    };
}