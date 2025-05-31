import { SettingsModel } from "../shared/models/SettingsModel";
import { CountryModel } from "./Country.model";
import { ProductModel } from "./Product.model";
import { PromoCodeModel } from "./PromoCode.model";

export interface RecordsDataModel {
    settings: SettingsModel;
    promoCodeFeatured: PromoCodeModel;
    countries: CountryModel[];
    products: ProductModel[];
}