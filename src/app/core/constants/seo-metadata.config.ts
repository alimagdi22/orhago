import { SeoConfig } from '../services/seo.service';

/**
 * Centralized Static SEO Metadata Configuration for Orahio
 * Static titles, descriptions, keywords, and OpenGraph values for each route.
 */
export const SEO_METADATA: Record<string, SeoConfig> = {
  home: {
    title: 'Orahio - Search & Book Flights and Hotels Worldwide',
    description: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with Orahio.',
    keywords: 'flights, hotels, cheap flights, flight booking, travel, airline tickets, hotel booking, orahio',
    ogTitle: 'Orahio - Search & Book Flights and Hotels Worldwide',
    ogDescription: 'Search, compare, and book cheap flights and hotels to your favorite destinations worldwide with Orahio.',
    ogImage: 'images/og-home.jpg',
    robots: 'index, follow',
  },
  aboutUs: {
    title: 'About Us - Orahio',
    description: 'Learn more about Orahio, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    keywords: 'about orahio, travel company, flight search engine, hotel booking, about us',
    ogTitle: 'About Us - Orahio',
    ogDescription: 'Learn more about Orahio, our mission, vision, and how we deliver seamless flight and hotel booking experiences.',
    robots: 'index, follow',
  },
  contactUs: {
    title: 'Contact Us & Customer Support - Orahio',
    description: 'Get in touch with Orahio customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    keywords: 'contact orahio, customer support, help center, flight help, hotel support',
    ogTitle: 'Contact Us & Customer Support - Orahio',
    ogDescription: 'Get in touch with Orahio customer support for assistance with flight bookings, hotel reservations, and inquiries.',
    robots: 'index, follow',
  },
  terms: {
    title: 'Terms & Conditions - Orahio',
    description: 'Read the official terms and conditions of service for using Orahio flight and hotel search and booking platform.',
    keywords: 'terms of service, terms and conditions, legal, orahio terms',
    ogTitle: 'Terms & Conditions - Orahio',
    ogDescription: 'Read the official terms and conditions of service for using Orahio flight and hotel search and booking platform.',
    robots: 'index, follow',
  },
  privacyPolicy: {
    title: 'Privacy Policy - Orahio',
    description: 'Learn how Orahio collects, uses, protects, and respects your privacy and personal data.',
    keywords: 'privacy policy, data protection, privacy, orahio privacy',
    ogTitle: 'Privacy Policy - Orahio',
    ogDescription: 'Learn how Orahio collects, uses, protects, and respects your privacy and personal data.',
    robots: 'index, follow',
  },
  flightResults: {
    title: 'Flight Search Results - Orahio',
    description: 'Compare best fares and schedules across top airlines on Orahio.',
    keywords: 'flight results, cheap flights, airline comparison, orahio flights',
    ogTitle: 'Flight Search Results - Orahio',
    ogDescription: 'Compare best fares and schedules across top airlines on Orahio.',
    robots: 'noindex, follow',
  },
  flightCheckout: {
    title: 'Flight Checkout & Passenger Details - Orahio',
    description: 'Complete your passenger details and secure your flight booking on Orahio.',
    ogTitle: 'Flight Checkout - Orahio',
    ogDescription: 'Complete your passenger details and secure your flight booking on Orahio.',
    robots: 'noindex, nofollow',
  },
  paymentResult: {
    title: 'Booking Confirmation - Orahio',
    description: 'View your flight booking confirmation and e-ticket status on Orahio.',
    ogTitle: 'Booking Confirmation - Orahio',
    ogDescription: 'View your flight booking confirmation and e-ticket status on Orahio.',
    robots: 'noindex, nofollow',
  },
  userManagement: {
    title: 'Account Settings & Booking History - Orahio',
    description: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    ogTitle: 'Account Settings - Orahio',
    ogDescription: 'Manage your profile details, passenger saved data, and view your flight and hotel booking history.',
    robots: 'noindex, nofollow',
  },
  hotelsResults: {
    title: 'Hotel Search Results - Orahio',
    description: 'Find and compare the best hotels at top destinations worldwide on Orahio.',
    keywords: 'hotel results, best hotels, hotel comparison, orahio hotels',
    ogTitle: 'Hotel Search Results - Orahio',
    ogDescription: 'Find and compare the best hotels at top destinations worldwide on Orahio.',
    robots: 'noindex, follow',
  },
  hotelsRooms: {
    title: 'Hotel Rooms & Availability - Orahio',
    description: 'View available rooms, amenities, and prices for your selected hotel on Orahio.',
    ogTitle: 'Hotel Rooms - Orahio',
    ogDescription: 'View available rooms, amenities, and prices for your selected hotel on Orahio.',
    robots: 'noindex, follow',
  },
  hotelsCheckout: {
    title: 'Hotel Checkout & Guest Details - Orahio',
    description: 'Complete your guest details and secure your hotel booking on Orahio.',
    ogTitle: 'Hotel Checkout - Orahio',
    ogDescription: 'Complete your guest details and secure your hotel booking on Orahio.',
    robots: 'noindex, nofollow',
  },
  hotelsConfirmation: {
    title: 'Hotel Booking Confirmation - Orahio',
    description: 'View your hotel booking confirmation and reservation details on Orahio.',
    ogTitle: 'Hotel Booking Confirmation - Orahio',
    ogDescription: 'View your hotel booking confirmation and reservation details on Orahio.',
    robots: 'noindex, nofollow',
  },
};
