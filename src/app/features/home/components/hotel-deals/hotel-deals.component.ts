import { Component, OnInit } from '@angular/core';
import { IHotelDeal } from './hotel-deals-card/hotel-deals-card.component';

@Component({
  standalone: false,
  selector: 'app-hotel-deals',
  templateUrl: './hotel-deals.component.html',
  styleUrl: './hotel-deals.component.scss',
})
export class HotelDealsComponent implements OnInit {
  currentPage = 1;
  pageSize = 4;
  totalPages = 4;
  pages = [1, 2, 3, 4];

  allDeals: IHotelDeal[] = [
    // Page 1
    {
      image: 'assets/images/popular/Dubai 3.png',
      type: 'Luxury',
      discount: '-30%',
      name: 'Fairmont Resort, Dubai United Arab Emirates',
      location: 'Dubai, UAE',
      price: '48.25$'
    },
    {
      image: 'assets/images/popular/Istanbul 2.png',
      type: 'Luxury',
      discount: '-30%',
      name: 'Fairmont Resort, Dubai United Arab Emirates',
      location: 'Dubai, UAE',
      price: '48.25$'
    },
    {
      image: 'assets/images/popular/Dubai 3.png',
      type: 'Luxury',
      discount: '-30%',
      name: 'Fairmont Resort, Dubai United Arab Emirates',
      location: 'Dubai, UAE',
      price: '48.25$'
    },
    {
      image: 'assets/images/popular/Istanbul 2.png',
      type: 'Luxury',
      discount: '-30%',
      name: 'Fairmont Resort, Dubai United Arab Emirates',
      location: 'Dubai, UAE',
      price: '48.25$'
    },
    // Page 2
    {
      image: 'assets/images/popular/Doha 3.png',
      type: 'Luxury',
      discount: '-25%',
      name: 'Sharq Village & Spa, Doha Qatar',
      location: 'Doha, Qatar',
      price: '55.00$'
    },
    {
      image: 'assets/images/popular/London 2.png',
      type: 'Luxury',
      discount: '-20%',
      name: 'The Ritz Hotel, London United Kingdom',
      location: 'London, UK',
      price: '85.50$'
    },
    {
      image: 'assets/images/popular/Maldives 2.png',
      type: 'Resort',
      discount: '-35%',
      name: 'Soneva Fushi, Baa Atoll Maldives',
      location: 'Baa Atoll, Maldives',
      price: '120.00$'
    },
    {
      image: 'assets/images/popular/Mecca 2.png',
      type: 'Luxury',
      discount: '-15%',
      name: 'Clock Tower Hotel, Makkah Saudi Arabia',
      location: 'Makkah, KSA',
      price: '62.00$'
    },
    // Page 3
    {
      image: 'assets/images/popular/Istanbul 3.png',
      type: 'Luxury',
      discount: '-25%',
      name: 'Ciragan Palace Kempinski, Istanbul Turkey',
      location: 'Istanbul, Turkey',
      price: '42.00$'
    },
    {
      image: 'assets/images/popular/London 3.png',
      type: 'Luxury',
      discount: '-30%',
      name: 'The Savoy Hotel, London United Kingdom',
      location: 'London, UK',
      price: '78.00$'
    },
    {
      image: 'assets/images/popular/Moscow 2.png',
      type: 'Luxury',
      discount: '-40%',
      name: 'Four Seasons Hotel, Moscow Russia',
      location: 'Moscow, Russia',
      price: '39.00$'
    },
    {
      image: 'assets/images/popular/Doha 2.png',
      type: 'Luxury',
      discount: '-20%',
      name: 'St. Regis Resort, Doha Qatar',
      location: 'Doha, Qatar',
      price: '68.00$'
    },
    // Page 4
    {
      image: 'assets/images/popular/Maldives 3.png',
      type: 'Resort',
      discount: '-30%',
      name: 'Anantara Veli Resort, Maldives',
      location: 'Maldives',
      price: '95.00$'
    },
    {
      image: 'assets/images/popular/Dubai 2.png',
      type: 'Luxury',
      discount: '-20%',
      name: 'Atlantis The Palm, Dubai UAE',
      location: 'Dubai, UAE',
      price: '99.00$'
    },
    {
      image: 'assets/images/popular/Mecca 3.png',
      type: 'Luxury',
      discount: '-25%',
      name: 'Raffles Makkah Palace, Saudi Arabia',
      location: 'Makkah, KSA',
      price: '75.00$'
    },
    {
      image: 'assets/images/popular/Moscow 3.png',
      type: 'Luxury',
      discount: '-35%',
      name: 'The Carlton Hotel, Moscow Russia',
      location: 'Moscow, Russia',
      price: '45.00$'
    }
  ];

  get currentDeals(): IHotelDeal[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allDeals.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {}

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
