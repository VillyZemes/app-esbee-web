import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { SettingsModel } from '../models/SettingsModel';
import { UtilsService } from '../services/utils.service';
import { PacketaAddressModel } from './models/PacketaAddressModel';
import { PacketaOptionsModel } from './models/PacketaOptionsModel';
import { PacketaPickupPointModel } from './models/PacketaPickupPointModel';

declare const Packeta: any;

@Component({
  selector: 'sb-packeta',
  imports: [FormsModule, CommonModule],
  templateUrl: './packeta.component.html',
  styleUrl: './packeta.component.scss'
})
export class PacketaComponent implements OnInit, OnDestroy {
  @Input() options: PacketaOptionsModel;
  @Input() settings: SettingsModel;
  @Input() totalPrice: number = 0;
  @Output() pickupPointSelected = new EventEmitter<PacketaPickupPointModel | null>();
  @Output() addressSelected = new EventEmitter<PacketaAddressModel | null>();
  @Output() deliveryTypeChanged = new EventEmitter<'pickup' | 'address'>();

  selectedPointText = '';
  selectedPickupPoint: any = null;
  selectedAddressText = '';
  selectedAddress: any = null;
  deliveryType: 'pickup' | 'address' = null;

  private readonly packetaApiKey = environment.packetaApiKey;
  private isWidgetOpen = false;
  private widgetContainer: HTMLElement | null = null;
  private static isAnyWidgetOpen = false; // Static flag to prevent multiple instances

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

  constructor(
    public utilsService: UtilsService,
  ) { }

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

  ngOnDestroy(): void {
    this.closeWidget();
  }

  openPacketaWidget(): void {
    // Check if Packeta is available
    if (typeof Packeta === 'undefined') {
      return;
    }

    // Prevent opening multiple widgets globally
    if (PacketaComponent.isAnyWidgetOpen) {
      return;
    }

    // Close any existing widget first
    this.closeWidget();

    try {
      this.isWidgetOpen = true;
      PacketaComponent.isAnyWidgetOpen = true;

      const callbackFunction = this.deliveryType === 'pickup'
        ? this.showSelectedPickupPoint.bind(this)
        : this.showSelectedAddress.bind(this);

      // Create a wrapper callback to ensure it's always called
      const wrappedCallback = (result: any) => {
        callbackFunction(result);
      };

      if (this.deliveryType === 'pickup') {
        Packeta.Widget.pick(this.packetaApiKey, wrappedCallback, this.packetaPickupOptions);
      } else if (this.deliveryType === 'address') {
        Packeta.Widget.pick(this.packetaApiKey, wrappedCallback, this.packetaAddressOptions);
      }
    } catch (error) {
      this.isWidgetOpen = false;
      PacketaComponent.isAnyWidgetOpen = false;
    }
  }

  private closeWidget(): void {
    if (!this.isWidgetOpen) {
      return;
    }

    try {
      if (typeof Packeta !== 'undefined' && Packeta.Widget && Packeta.Widget.close) {
        Packeta.Widget.close();
      }
    } catch (error) {
    } finally {
      this.isWidgetOpen = false;
      PacketaComponent.isAnyWidgetOpen = false;
      this.widgetContainer = null;
    }
  }

  private showSelectedPickupPoint(point: any): void {
    this.isWidgetOpen = false;
    PacketaComponent.isAnyWidgetOpen = false;
    this.widgetContainer = null;

    if (point && point !== null && point !== undefined) {
      this.selectedPointText = "Výdajné miesto: " + point.name;
      this.selectedPickupPoint = point;
      this.pickupPointSelected.emit(point);
    } else {
      // Widget was closed without selection - reset delivery type
      this.selectedPointText = '';
      this.selectedPickupPoint = null;
      this.deliveryType = null;
      this.deliveryTypeChanged.emit(null);
      this.pickupPointSelected.emit(null);
    }
  }

  private showSelectedAddress(address: any): void {
    this.isWidgetOpen = false;
    PacketaComponent.isAnyWidgetOpen = false;
    this.widgetContainer = null;

    if (address && address !== null && address !== undefined && address.address) {
      const addressObject = address.address;
      this.selectedAddressText = `Address: ${addressObject?.street} ${addressObject?.houseNumber}, ${addressObject?.city} ${addressObject?.postcode}`;
      this.selectedAddress = addressObject;
      this.addressSelected.emit(addressObject);
    } else {
      // Widget was closed without selection - reset delivery type
      this.selectedAddressText = '';
      this.selectedAddress = null;
      this.deliveryType = null;
      this.deliveryTypeChanged.emit(null);
      this.addressSelected.emit(null);
    }
  }

  onDeliveryTypeChange(event: any): void {
    this.deliveryTypeChanged.emit(event.target.value);

    // Clear selections when changing delivery type
    this.selectedPointText = '';
    this.selectedPickupPoint = null;
    this.selectedAddressText = '';
    this.selectedAddress = null;

    if (event.target.value === 'pickup' || event.target.value === 'address') {
      // Longer delay to ensure cleanup is complete
      setTimeout(() => {
        this.openPacketaWidget();
      }, 500);
    } else {
      this.closeWidget();
    }
  }
}
