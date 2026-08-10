import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: false,
  selector: 'app-site-advantages',
  templateUrl: './site-advantages.component.html',
  styleUrl: './site-advantages.component.scss',
})
export class SiteAdvantagesComponent implements AfterViewInit {
  @ViewChild('swiperEl', { static: false }) swiperEl!: ElementRef;

  translate = inject(TranslateService);

  cards = [
    {
      ar: {
        title: 'خيارات لا حصر لها',
        description: 'يقارن رحلات الطيران من أكثر من 450 شركة طيران لتجلب لك أفضل العروض.',
        image: 'world-icon.svg',
      },

      en: {
        title: 'Countless options',
        description: 'Travelo compares flights from 450+ airlines to bring you the best deals.',
        image: 'world-icon.svg',
      },
    },
    {
      ar: {
        title: 'سريعة وسهلة',
        description: 'احجز أفضل الرحلات بسرعة وسهولة ببضع نقرات فقط.',
        image: 'history-icon.svg',
      },

      en: {
        title: 'Quick and easy',
        description: 'Book the best flights quickly and easily with just a few clicks.',
        image: 'history-icon.svg',
      },
    },
    {
      ar: {
        title: 'شراء بشكل آمن',
        description: 'يتم تأمين مدفوعاتك بواسطة DigiCert، الرائدة في مجال حماية الشهادات الرقمية.',
        image: 'shield-icon.svg',
      },

      en: {
        title: 'Purchase securely',
        description: 'Your payments are secured by DigiCert, a leader in digital certificate protection.',
        image: 'shield-icon.svg',
      },
    },
  ];

  ngAfterViewInit(): void {
    if (this.swiperEl?.nativeElement) {
      const swiper = this.swiperEl.nativeElement;

      Object.assign(swiper, {
        spaceBetween: 20,
        pagination: { bulletClass: 'hide' },
        breakpoints: {
          0: { slidesPerView: 1 }, // Mobile view (default)
          768: { slidesPerView: 2 }, // Tablets
          1024: { slidesPerView: 3 }, // Desktops
        },
      });
    }
  }

  get lang(): 'en' | 'ar' {
    const current = this.translate.currentLang || this.translate.defaultLang || 'en';
    return (current === 'ar' ? 'ar' : 'en') as 'ar' | 'en';
  }
}
