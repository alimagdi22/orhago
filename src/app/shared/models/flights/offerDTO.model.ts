import { IAirline } from './airline.model';

export interface IHotemAmenties {
  amenity: string;
}
export interface IIncludedCity {
  CityCode: string;
  CityName: string;
  CityType: string;
}
export interface IImage {
  imageDescription: string;
  url: string;
  imageID?: number;
  serviceIndex?: number;
  dayIndex?: number;
}

export interface IOfferDay {
  DayDescription: string;
  DayDate: Date;
  OfferServices: IOfferService[];
}

export interface IOfferService {
  serviceType: string;
  serviceDescription: string;
  servicePrice: number;
  includedCities: IIncludedCity[];
  serviceImage: IImage[];
  airline: IAirline[];
  offlineItinerary: number | string;
  hotelName: string;
  hotelRate: number;
  roomBasis: string;
  nights: number;
  roomType: string;
  hotelAmenties: IHotemAmenties[];
}

export interface IOfferDTO {
  agentId: string;
  bookedQuantity: number;
  currency: string;
  endDate: Date;
  imageID: number;
  netProfit: number;
  offerCode: number;
  offerDays: IOfferDay[];
  offerDescription: string;
  offerImage: IImage;
  offerName: string;
  offerProvider: string;
  offerServices: IOfferService[];
  offerStatus: number;
  offerTag: number;
  paymentMethod: string;
  pos: string;
  salesChannel: string;
  totalSellPrice: number;
  startDate: Date;
  totalCostPrice: number;
  totalQuantity: number;
}
