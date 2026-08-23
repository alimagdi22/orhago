import { SeoConfig } from '../services/seo.service';

/**
 * Centralized Static SEO Metadata Configuration for orhas
 * Static titles, descriptions, keywords, and OpenGraph values for each route.
 */
export const SEO_METADATA: Record<string, SeoConfig> = {
  home: {
    title: 'orhas - Search & Book Flights and Hotels Worldwide',
    description: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhas.',
    keywords: 'flights, hotels, cheap flights, flight booking, travel, airline tickets, hotel booking, orhas',
    ogTitle: 'orhas - Search & Book Flights and Hotels Worldwide',
    ogDescription: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with orhas.',
    ogImage: 'images/og-home.jpg',
    robots: 'index, follow',
  },
  aboutUs: {
    title: 'About Us - orhas',
    description: 'Learn more about orhas, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    keywords: 'about orhas, travel company, flight search engine, hotel booking, about us',
    ogTitle: 'About Us - orhas',
    ogDescription: 'Learn more about orhas, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    robots: 'index, follow',
  },
  contactUs: {
    title: 'Contact Us & Customer Support - orhas',
    description: 'Get in touch with orhas customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    keywords: 'contact orhas, customer support, help center, flight help, hotel support',
    ogTitle: 'Contact Us & Customer Support - orhas',
    ogDescription: 'Get in touch with orhas customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    robots: 'index, follow',
  },
  terms: {
    title: 'Terms & Conditions - orhas',
    description: 'Read the official terms and conditions of service for using orhas flight and hotel search and booking platform.',
    keywords: 'terms of service, terms and conditions, legal, orhas terms',
    ogTitle: 'Terms & Conditions - orhas',
    ogDescription: 'Read the official terms and conditions of service for using orhas flight and hotel search and booking platform.',
    robots: 'index, follow',
  },
  privacyPolicy: {
    title: 'Privacy Policy - orhas',
    description: 'Learn how orhas collects, uses, protects, and respects your privacy and personal data.',
    keywords: 'privacy policy, data protection, privacy, orhas privacy',
    ogTitle: 'Privacy Policy - orhas',
    ogDescription: 'Learn how orhas collects, uses, protects, and respects your privacy and personal data.',
    robots: 'index, follow',
  },
  flightResults: {
    title: 'Flight Search Results - orhas',
    description: 'Compare best fares and schedules across top airlines on orhas.',
    keywords: 'flight results, cheap flights, airline comparison, orhas flights',
    ogTitle: 'Flight Search Results - orhas',
    ogDescription: 'Compare best fares and schedules across top airlines on orhas.',
    robots: 'noindex, follow',
  },
  flightCheckout: {
    title: 'Flight Checkout & Passenger Details - orhas',
    description: 'Complete your passenger details and secure your flight booking on orhas.',
    ogTitle: 'Flight Checkout - orhas',
    ogDescription: 'Complete your passenger details and secure your flight booking on orhas.',
    robots: 'noindex, nofollow',
  },
  paymentResult: {
    title: 'Booking Confirmation - orhas',
    description: 'View your flight booking confirmation and e-ticket status on orhas.',
    ogTitle: 'Booking Confirmation - orhas',
    ogDescription: 'View your flight booking confirmation and e-ticket status on orhas.',
    robots: 'noindex, nofollow',
  },
  userManagement: {
    title: 'Account Settings & Booking History - orhas',
    description: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    ogTitle: 'Account Settings - orhas',
    ogDescription: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    robots: 'noindex, nofollow',
  },
  hotelsResults: {
    title: 'Hotel Search Results - orhas',
    description: 'Find and compare the best hotels at top destinations worldwide on orhas.',
    keywords: 'hotel results, best hotels, hotel comparison, orhas hotels',
    ogTitle: 'Hotel Search Results - orhas',
    ogDescription: 'Find and compare the best hotels at top destinations worldwide on orhas.',
    robots: 'noindex, follow',
  },
  hotelsRooms: {
    title: 'Hotel Rooms & Availability - orhas',
    description: 'View available rooms, amenities, and prices for your selected hotel on orhas.',
    ogTitle: 'Hotel Rooms - orhas',
    ogDescription: 'View available rooms, amenities, and prices for your selected hotel on orhas.',
    robots: 'noindex, follow',
  },
  hotelsCheckout: {
    title: 'Hotel Checkout & Guest Details - orhas',
    description: 'Complete your guest details and secure your hotel booking on orhas.',
    ogTitle: 'Hotel Checkout - orhas',
    ogDescription: 'Complete your guest details and secure your hotel booking on orhas.',
    robots: 'noindex, nofollow',
  },
  hotelsConfirmation: {
    title: 'Hotel Booking Confirmation - orhas',
    description: 'View your hotel booking confirmation and reservation details on orhas.',
    ogTitle: 'Hotel Booking Confirmation - orhas',
    ogDescription: 'View your hotel booking confirmation and reservation details on orhas.',
    robots: 'noindex, nofollow',
  },
};
