import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { PricePipe } from '../../pipes/price.pipe';
import { PacketaPickupPointModel } from './models/PacketaPickupPointModel';
import { PacketaAddressModel } from './models/PacketaAddressModel';
import { PacketaOptionsModel } from './models/PacketaOptionsModel';

declare const Packeta: any;

@Component({
  selector: 'sb-packeta',
  imports: [FormsModule, CommonModule, PricePipe],
  templateUrl: './packeta.component.html',
  styleUrl: './packeta.component.scss'
})
export class PacketaComponent implements OnInit {
  @Input() options: PacketaOptionsModel;
  @Output() pickupPointSelected = new EventEmitter<PacketaPickupPointModel | null>();
  @Output() addressSelected = new EventEmitter<PacketaAddressModel | null>();
  @Output() deliveryTypeChanged = new EventEmitter<string>();

  selectedPointText = '';
  selectedPickupPoint: PacketaPickupPointModel;
  selectedAddressText = '';
  selectedAddress: PacketaAddressModel;
  deliveryType = '';

  private readonly packetaApiKey = environment.packetaApiKey;

  packetaPickupOptions = {
    country: "cz,sk",
    language: "sk",
    valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
    view: "modal",
  };

  packetaAddressOptions = {
    layout: "hd",
    carrierId: "131",
    country: "cz,sk",
    language: "sk",
    centerCountry: "sk",
  };

  ngOnInit(): void {
    if (this.options) {
      if (this.options.packetaPickupOptions) {
        Object.keys(this.options.packetaPickupOptions).forEach(key => {
          const value = this.options.packetaPickupOptions[key as keyof typeof this.options.packetaPickupOptions];
          if (value !== undefined && value !== null && value !== '') {
            (this.packetaPickupOptions as any)[key] = value;
          }
        });
      }
      if (this.options.packetaAddressOptions) {
        Object.keys(this.options.packetaAddressOptions).forEach(key => {
          const value = this.options.packetaAddressOptions[key as keyof typeof this.options.packetaAddressOptions];
          if (value !== undefined && value !== null && value !== '') {
            (this.packetaAddressOptions as any)[key] = value;
          }
        });
      }
    }
  }

  openPacketaWidget(): void {
    if (this.deliveryType === 'pickup') {
      Packeta.Widget.pick(this.packetaApiKey, this.showSelectedPickupPoint.bind(this), this.packetaPickupOptions);
    } else if (this.deliveryType === 'address') {
      Packeta.Widget.pick(this.packetaApiKey, this.showSelectedAddress.bind(this), this.packetaAddressOptions);
    }
  }

  private showSelectedPickupPoint(point: any): void {
    this.selectedPointText = '';
    this.selectedPickupPoint = null;

    if (point) {
      console.log("Selected pickup point", point);
      this.selectedPointText = "Výdajné miesto: " + point.name;
      this.selectedPickupPoint = point;
      this.pickupPointSelected.emit(point);
    } else {
      // Widget was closed without selection
      this.deliveryType = '';
      this.deliveryTypeChanged.emit('');
      this.pickupPointSelected.emit(null);
    }
  }

  private showSelectedAddress(address: any): void {
    this.selectedAddressText = '';
    this.selectedAddress = null;

    if (address) {
      const addressObject = address?.address;
      console.log("Selected address", addressObject);
      this.selectedAddressText = `Address: ${addressObject.street} ${addressObject.houseNumber}, ${addressObject.city} ${addressObject.postcode}`;
      this.selectedAddress = addressObject;
      this.addressSelected.emit(addressObject);
    } else {
      // Widget was closed without selection
      this.deliveryType = '';
      this.deliveryTypeChanged.emit('');
      this.addressSelected.emit(null);
    }
  }

  onDeliveryTypeChange(event: any): void {
    this.deliveryTypeChanged.emit(event.target.value);

    if (event.target.value === 'pickup' || event.target.value === 'address') {
      setTimeout(() => {
        this.openPacketaWidget();
      }, 100);
    }
  }
}
