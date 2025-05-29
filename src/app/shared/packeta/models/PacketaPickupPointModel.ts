export interface PacketaPickupPointModel {
    businessDaysOpenLunchtime: boolean;
    businessDaysOpenUpTo: number;
    city: string;
    claimAssistant: boolean;
    country: string;
    creditCardPayment: boolean;
    currency: string;
    directions: string;
    directionsCar: string;
    directionsPublic: string;
    error: string | null;
    gps: {
        lat: number;
        lon: number;
    };
    holidayEnd: string | null;
    holidayStart: string | null;
    exceptionDays: any[];
    externalId: string;
    id: string;
    isNew: boolean;
    maxWeight: number;
    name: string;
    nameStreet: string;
    openingHours: {
        compactShort: string;
        compactLong: string;
        tableLong: string;
        exceptions: any[];
        regular: {
            monday: string;
            tuesday: string;
            wednesday: string;
            thursday: string;
            friday: string;
            saturday: string;
            sunday: string;
        };
    };
    packetConsignment: boolean;
    photos: {
        thumbnail: string;
        normal: string;
    }[];
    photo: {
        thumbnail: string;
        normal: string;
    }[];
    place: string;
    recommended: string;
    saturdayOpenTo: number;
    special: string;
    street: string;
    sundayOpenTo: number;
    url: string;
    branchCode: string;
    warning: string;
    wheelchairAccessible: boolean;
    zip: string;
    pickupPointType: string;
    carrierPickupPointId: string | null;
    carrierId: string | null;
    routingCode: string;
    routingName: string;
    group: string;
    formatedValue: string;
}