import { DefaultModel } from "./DefaultModel";

export interface SettingsModel extends DefaultModel {
    shipping_free_threshold: number;
    shipping_packeta_pudo: number;
    shipping_packeta_home: number;
    vat_rate: number;
}