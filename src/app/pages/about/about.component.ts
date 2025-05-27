import { Component, Input } from '@angular/core';
import { UtilsService } from '../../shared/services/utils.service';

export interface SectionBlock {
  title: string;
  image: string;
  paragraphs?: { text: string; quotation: boolean }[];
  listOptions?: string[];
  button?: { text: string; link: string };
}


@Component({
  selector: 'sb-about',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  @Input() asComponent: boolean = false;

  aboutSections: SectionBlock[] = [
    {
      title: 'Kto sme?',
      image: 'images/DSC00139.jpg',
      paragraphs: [
        {
          text: 'Sme slovenská značka, ktorá vznikla z jednoduchej myšlienky – zmeniť spôsob, akým vnímame vôňu v domácnosti.',
          quotation: false
        },
        {
          text: 'Už roky sa venujeme vývoju a výskumu inovatívnych vôní určených priamo pre klimatizačné systémy. Naším cieľom od začiatku nebolo len vytvoriť ďalší „aromatický doplnok“, ale posunúť samotný význam klimatizácie – premeniť ju na nástroj príjemnej atmosféry a pohody.',
          quotation: false
        }
      ],
      button: {
        text: 'Prečítajte si viac',
        link: '/o-nas'
      }
    },
    {
      title: 'Prečo si vybrať eSbee?',
      image: 'images/DSC00134.jpg',
      paragraphs: [
        {
          text: 'Praktický doplnok do klimatizácie, ktorý premení domov na miesto sviežosti,pohody a čistoty.',
          quotation: true
        },
      ],
      listOptions: [
        'Jednoduchá montáž, ktorú zvládne každý, bez nutnosti rozoberania klimatizácie',
        'Silná a dlhotrvajúca vôňa, ktorá rozvonia každý priestor',
        'Elegantný a prémiový dizajn',
        'Obsahuje aktívne uhlie',
      ],
      button: {
        text: 'Preskúmať našu ponuku',
        link: '/obchod'
      }
    },
    {
      title: 'Výhody aktívneho uhlia',
      image: 'images/DSC00052.jpg',
      listOptions: [
        'Prírodné, netoxické a bezpečné pre domácnosť ,deti a zvieratá',
        'Pohlcuje baktérie ,plesne a alergény šíriace sa klimatizáciou',
        'Napomáha redukovať prach a jemné častice vo vzduchu',
        'V kombinácii s vôňou zabezpečuje svieži a hygienickejší vzduch',
      ],
      button: {
        text: 'Prečítajte si viac',
        link: '/obchod'
      }
    },
  ];

  constructor(
    public utilsService: UtilsService
  ) { }
}
