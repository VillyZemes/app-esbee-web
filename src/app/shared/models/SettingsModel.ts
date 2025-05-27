import { DefaultModel } from "./DefaultModel";

export interface SettingsModel extends DefaultModel {
    free_shipping_threshold: number;
}