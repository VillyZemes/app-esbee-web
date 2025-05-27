import { DefaultModel } from "./DefaultModel";

export interface OptionsModel extends DefaultModel {
    id: any;
    code?: string;
    display: string;
    short?: string;
    order?: number;
}