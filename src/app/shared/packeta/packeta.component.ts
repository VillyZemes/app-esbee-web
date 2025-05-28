import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { PricePipe } from '../../pipes/price.pipe';

declare const Packeta: any;

@Component({
  selector: 'sb-packeta',
  imports: [FormsModule, CommonModule, PricePipe],
  templateUrl: './packeta.component.html',
  styleUrl: './packeta.component.scss'
})
export class PacketaComponent implements OnInit {
  selectedPointText = '';
  deliveryType = 'pickup';

  private readonly packetaApiKey = environment.packetaApiKey;

  private readonly packetaOptions = {
    country: "cz,sk",
    language: "sk",
    valueFormat: "\"Packeta\",id,carrierId,carrierPickupPointId,name,city,street",
    view: "modal"
  };

  ngOnInit(): void {
  }

  openPacketaWidget(): void {
    Packeta.Widget.pick(this.packetaApiKey, this.showSelectedPickupPoint.bind(this), this.packetaOptions);
  }

  private showSelectedPickupPoint(point: any): void {
    this.selectedPointText = '';
    if (point) {
      console.log("Selected point", point);
      this.selectedPointText = "Address: " + point.formatedValue;
    }
  }

  onDeliveryTypeChange(event: any): void {
    if (event.target.value === 'pickup') {
      setTimeout(() => {
        this.openPacketaWidget();
      }, 100);
    }
  }
}
