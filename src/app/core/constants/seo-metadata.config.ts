import { SeoConfig } from '../services/seo.service';

/**
 * Centralized Static SEO Metadata Configuration for hogozati
 * Static titles, descriptions, keywords, and OpenGraph values for each route.
 */
export const SEO_METADATA: Record<string, SeoConfig> = {
  home: {
    title: 'hogozati - Search & Book Flights and Hotels Worldwide',
    description: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with hogozati.',
    keywords: 'flights, hotels, cheap flights, flight booking, travel, airline tickets, hotel booking, hogozati',
    ogTitle: 'hogozati - Search & Book Flights and Hotels Worldwide',
    ogDescription: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with hogozati.',
    ogImage: 'images/og-home.jpg',
    robots: 'index, follow',
  },
  aboutUs: {
    title: 'About Us - hogozati',
    description: 'Learn more about hogozati, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    keywords: 'about hogozati, travel company, flight search engine, hotel booking, about us',
    ogTitle: 'About Us - hogozati',
    ogDescription: 'Learn more about hogozati, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    robots: 'index, follow',
  },
  contactUs: {
    title: 'Contact Us & Customer Support - hogozati',
    description: 'Get in touch with hogozati customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    keywords: 'contact hogozati, customer support, help center, flight help, hotel support',
    ogTitle: 'Contact Us & Customer Support - hogozati',
    ogDescription: 'Get in touch with hogozati customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    robots: 'index, follow',
  },
  terms: {
    title: 'Terms & Conditions - hogozati',
    description: 'Read the official terms and conditions of service for using hogozati flight and hotel search and booking platform.',
    keywords: 'terms of service, terms and conditions, legal, hogozati terms',
    ogTitle: 'Terms & Conditions - hogozati',
    ogDescription: 'Read the official terms and conditions of service for using hogozati flight and hotel search and booking platform.',
    robots: 'index, follow',
  },
  privacyPolicy: {
    title: 'Privacy Policy - hogozati',
    description: 'Learn how Hogozati collects, uses, protects, and respects your privacy and personal data.',
    keywords: 'privacy policy, data protection, privacy, hogozati privacy',
    ogTitle: 'Privacy Policy - hogozati',
    ogDescription: 'Learn how Hogozati collects, uses, protects, and respects your privacy and personal data.',
    robots: 'index, follow',
  },
  flightResults: {
    title: 'Flight Search Results - hogozati',
    description: 'Compare best fares and schedules across top airlines on hogozati.',
    keywords: 'flight results, cheap flights, airline comparison, hogozati flights',
    ogTitle: 'Flight Search Results - hogozati',
    ogDescription: 'Compare best fares and schedules across top airlines on hogozati.',
    robots: 'noindex, follow',
  },
  flightCheckout: {
    title: 'Flight Checkout & Passenger Details - hogozati',
    description: 'Complete your passenger details and secure your flight booking on hogozati.',
    ogTitle: 'Flight Checkout - hogozati',
    ogDescription: 'Complete your passenger details and secure your flight booking on hogozati.',
    robots: 'noindex, nofollow',
  },
  paymentResult: {
    title: 'Booking Confirmation - hogozati',
    description: 'View your flight booking confirmation and e-ticket status on hogozati.',
    ogTitle: 'Booking Confirmation - hogozati',
    ogDescription: 'View your flight booking confirmation and e-ticket status on hogozati.',
    robots: 'noindex, nofollow',
  },
  userManagement: {
    title: 'Account Settings & Booking History - hogozati',
    description: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    ogTitle: 'Account Settings - hogozati',
    ogDescription: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    robots: 'noindex, nofollow',
  },
  hotelsResults: {
    title: 'Hotel Search Results - hogozati',
    description: 'Find and compare the best hotels at top destinations worldwide on hogozati.',
    keywords: 'hotel results, best hotels, hotel comparison, hogozati hotels',
    ogTitle: 'Hotel Search Results - hogozati',
    ogDescription: 'Find and compare the best hotels at top destinations worldwide on hogozati.',
    robots: 'noindex, follow',
  },
  hotelsRooms: {
    title: 'Hotel Rooms & Availability - hogozati',
    description: 'View available rooms, amenities, and prices for your selected hotel on hogozati.',
    ogTitle: 'Hotel Rooms - hogozati',
    ogDescription: 'View available rooms, amenities, and prices for your selected hotel on hogozati.',
    robots: 'noindex, follow',
  },
  hotelsCheckout: {
    title: 'Hotel Checkout & Guest Details - hogozati',
    description: 'Complete your guest details and secure your hotel booking on hogozati.',
    ogTitle: 'Hotel Checkout - hogozati',
    ogDescription: 'Complete your guest details and secure your hotel booking on hogozati.',
    robots: 'noindex, nofollow',
  },
  hotelsConfirmation: {
    title: 'Hotel Booking Confirmation - hogozati',
    description: 'View your hotel booking confirmation and reservation details on hogozati.',
    ogTitle: 'Hotel Booking Confirmation - hogozati',
    ogDescription: 'View your hotel booking confirmation and reservation details on hogozati.',
    robots: 'noindex, nofollow',
  },
};
