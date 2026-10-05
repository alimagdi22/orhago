export interface IAirPort {
  airportCode: string;
  airportName: string;
  cityName: string;
  cityCode: string;
  countryCode: string;
  countryName: string;
  regionName: string;
  isCitySelection?: boolean;
}

export interface IAirPortTranslated {
  ar: {
    airportCode: string;
    airportName: string;
    cityName: string;
    cityCode: string;
    countryCode: string;
    countryName: string;
    regionName: string;
  },
  en: {
    airportCode: string;
    airportName: string;
    cityName: string;
    cityCode: string;
    countryCode: string;
    countryName: string;
    regionName: string;
  }
}