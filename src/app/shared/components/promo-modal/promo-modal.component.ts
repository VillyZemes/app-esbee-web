import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PromoCodeModel } from '../../../models/PromoCode.model';
import { RecordsDataService } from '../../services/records-data.service';
import { CookiesService } from '../../services/cookies.service';
import { UtilsService } from '../../services/utils.service';

@Component({
    selector: 'sb-promo-modal',
    imports: [CommonModule],
    templateUrl: './promo-modal.component.html',
    styleUrl: './promo-modal.component.scss'
})
export class PromoModalComponent implements OnInit {
    @Input() promoCode: PromoCodeModel | null = null;

    private readonly PROMOS_COOKIE_NAME = 'esbee_promos';

    show = false;
    copied = false;

    constructor(
        private router: Router,
        private recordsDataService: RecordsDataService,
        private cookiesService: CookiesService,
        private utilsService: UtilsService,
    ) { }

    ngOnInit(): void {
        this.recordsDataService.fetchRecordsData().subscribe((data) => {
            this.promoCode = data.promoCodeFeatured;
            if (!this.hasSeenPromoModal()) {
                setTimeout(() => {
                    this.show = true;
                }, 2000); // Show after 2 seconds
            }
        });
    }

    private hasSeenPromoModal(): boolean {
        const seenPromos = this.cookiesService.getCookie(this.PROMOS_COOKIE_NAME);
        if (!seenPromos) return false;

        try {
            const seenPromosArray = JSON.parse(seenPromos);
            return seenPromosArray.includes(this.promoCode?.hash);
        } catch {
            return false;
        }
    }

    closeModal(): void {
        this.show = false;

        // Mark this promo as seen
        if (this.promoCode?.hash) {
            const existingSeenPromos = this.cookiesService.getCookie(this.PROMOS_COOKIE_NAME);
            let seenPromos: string[] = [];

            if (existingSeenPromos) {
                try {
                    seenPromos = JSON.parse(existingSeenPromos);
                } catch {
                    seenPromos = [];
                }
            }

            seenPromos.push(this.promoCode.hash);
            this.cookiesService.setCookie(this.PROMOS_COOKIE_NAME, JSON.stringify(seenPromos), 30); // 30 days
        }
    }

    copyPromoCode(): void {
        if (this.promoCode?.code) {
            navigator.clipboard.writeText(this.promoCode.code).then(() => {
                console.log('Promo code copied to clipboard');
                this.copied = true;
                setTimeout(() => {
                    this.copied = false;
                }, 2000);
            });
        }
    }

    goToShop(): void {
        this.closeModal();
        this.utilsService.routerTo('/obchod');
    }
}
