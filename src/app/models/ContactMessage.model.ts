import { DefaultModel } from "../shared/models/DefaultModel";

export interface ContactMessageModel extends DefaultModel {
    name?: string;
    email: string;
    subject?: string;
    message: string;
    is_read?: boolean;
    read_at?: Date;
    gdpr?: boolean;
}