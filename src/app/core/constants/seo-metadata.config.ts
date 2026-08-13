import { SeoConfig } from '../services/seo.service';

/**
 * Centralized Static SEO Metadata Configuration for orhago
 * Static titles, descriptions, keywords, and OpenGraph values for each route.
 */
export const SEO_METADATA: Record<string, SeoConfig> = {
  home: {
    title: 'orhago - Search & Book Flights and Hotels Worldwide',
    description: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhago.',
    keywords: 'flights, hotels, cheap flights, flight booking, travel, airline tickets, hotel booking, orhago',
    ogTitle: 'orhago - Search & Book Flights and Hotels Worldwide',
    ogDescription: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhago.',
    ogImage: 'images/og-home.jpg',
    robots: 'index, follow',
  },
  aboutUs: {
    title: 'About Us - orhago',
    description: 'Learn more about orhago, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    keywords: 'about orhago, travel company, flight search engine, hotel booking, about us',
    ogTitle: 'About Us - orhago',
    ogDescription: 'Learn more about orhago, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    robots: 'index, follow',
  },
  contactUs: {
    title: 'Contact Us & Customer Support - orhago',
    description: 'Get in touch with orhago customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    keywords: 'contact orhago, customer support, help center, flight help, hotel support',
    ogTitle: 'Contact Us & Customer Support - orhago',
    ogDescription: 'Get in touch with orhago customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    robots: 'index, follow',
  },
  terms: {
    title: 'Terms & Conditions - orhago',
    description: 'Read the official terms and conditions of service for using orhago flight and hotel search and booking platform.',
    keywords: 'terms of service, terms and conditions, legal, orhago terms',
    ogTitle: 'Terms & Conditions - orhago',
    ogDescription: 'Read the official terms and conditions of service for using orhago flight and hotel search and booking platform.',
    robots: 'index, follow',
  },
  privacyPolicy: {
    title: 'Privacy Policy - orhago',
    description: 'Learn how orhago collects, uses, protects, and respects your privacy and personal data.',
    keywords: 'privacy policy, data protection, privacy, orhago privacy',
    ogTitle: 'Privacy Policy - orhago',
    ogDescription: 'Learn how orhago collects, uses, protects, and respects your privacy and personal data.',
    robots: 'index, follow',
  },
  flightResults: {
    title: 'Flight Search Results - orhago',
    description: 'Compare best fares and schedules across top airlines on orhago.',
    keywords: 'flight results, cheap flights, airline comparison, orhago flights',
    ogTitle: 'Flight Search Results - orhago',
    ogDescription: 'Compare best fares and schedules across top airlines on orhago.',
    robots: 'noindex, follow',
  },
  flightCheckout: {
    title: 'Flight Checkout & Passenger Details - orhago',
    description: 'Complete your passenger details and secure your flight booking on orhago.',
    ogTitle: 'Flight Checkout - orhago',
    ogDescription: 'Complete your passenger details and secure your flight booking on orhago.',
    robots: 'noindex, nofollow',
  },
  paymentResult: {
    title: 'Booking Confirmation - orhago',
    description: 'View your flight booking confirmation and e-ticket status on orhago.',
    ogTitle: 'Booking Confirmation - orhago',
    ogDescription: 'View your flight booking confirmation and e-ticket status on orhago.',
    robots: 'noindex, nofollow',
  },
  userManagement: {
    title: 'Account Settings & Booking History - orhago',
    description: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    ogTitle: 'Account Settings - orhago',
    ogDescription: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    robots: 'noindex, nofollow',
  },
  hotelsResults: {
    title: 'Hotel Search Results - orhago',
    description: 'Find and compare the best hotels at top destinations worldwide on orhago.',
    keywords: 'hotel results, best hotels, hotel comparison, orhago hotels',
    ogTitle: 'Hotel Search Results - orhago',
    ogDescription: 'Find and compare the best hotels at top destinations worldwide on orhago.',
    robots: 'noindex, follow',
  },
  hotelsRooms: {
    title: 'Hotel Rooms & Availability - orhago',
    description: 'View available rooms, amenities, and prices for your selected hotel on orhago.',
    ogTitle: 'Hotel Rooms - orhago',
    ogDescription: 'View available rooms, amenities, and prices for your selected hotel on orhago.',
    robots: 'noindex, follow',
  },
  hotelsCheckout: {
    title: 'Hotel Checkout & Guest Details - orhago',
    description: 'Complete your guest details and secure your hotel booking on orhago.',
    ogTitle: 'Hotel Checkout - orhago',
    ogDescription: 'Complete your guest details and secure your hotel booking on orhago.',
    robots: 'noindex, nofollow',
  },
  hotelsConfirmation: {
    title: 'Hotel Booking Confirmation - orhago',
    description: 'View your hotel booking confirmation and reservation details on orhago.',
    ogTitle: 'Hotel Booking Confirmation - orhago',
    ogDescription: 'View your hotel booking confirmation and reservation details on orhago.',
    robots: 'noindex, nofollow',
  },
};
