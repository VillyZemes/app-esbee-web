import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductComponent } from './pages/product/product.component';
import { AboutComponent } from './pages/about/about.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'domov', component: LandingComponent },
  { path: 'o-nas', component: AboutComponent },
  { path: 'obchod', component: ShopComponent },
  { path: 'kosik', component: CartComponent },
  { path: 'kontakt', component: ContactComponent },
  { path: 'produkt/:id', component: ProductComponent },
  { path: '**', component: NotFoundComponent }
];