import { IAirPortTranslated } from '../models/airport.model';

const airport = (
  en: IAirPortTranslated['en'],
  ar: IAirPortTranslated['ar'],
): IAirPortTranslated => ({ en, ar });

const LOCATION_AIRPORTS: Record<string, IAirPortTranslated> = {
  CAI: airport(
    { airportCode: 'CAI', airportName: 'Cairo International Airport', cityName: 'Cairo', cityCode: 'CAI', countryCode: 'EG', countryName: 'Egypt', regionName: 'Africa' },
    { airportCode: 'CAI', airportName: 'مطار القاهرة الدولي', cityName: 'القاهرة', cityCode: 'CAI', countryCode: 'EG', countryName: 'مصر', regionName: 'Africa' },
  ),
  PTS: airport(
    { airportCode: 'CAI', airportName: 'Cairo International Airport', cityName: 'Port Said', cityCode: 'CAI', countryCode: 'EG', countryName: 'Egypt', regionName: 'Africa' },
    { airportCode: 'CAI', airportName: 'مطار القاهرة الدولي', cityName: 'بور سعيد', cityCode: 'CAI', countryCode: 'EG', countryName: 'مصر', regionName: 'Africa' },
  ),
  HBE: airport(
    { airportCode: 'HBE', airportName: 'Borg El Arab Airport', cityName: 'Alexandria', cityCode: 'HBE', countryCode: 'EG', countryName: 'Egypt', regionName: 'Africa' },
    { airportCode: 'HBE', airportName: 'مطار برج العرب', cityName: 'الإسكندرية', cityCode: 'HBE', countryCode: 'EG', countryName: 'مصر', regionName: 'Africa' },
  ),
  SSH: airport(
    { airportCode: 'SSH', airportName: 'Sharm El Sheikh International Airport', cityName: 'Sharm El Sheikh', cityCode: 'SSH', countryCode: 'EG', countryName: 'Egypt', regionName: 'Africa' },
    { airportCode: 'SSH', airportName: 'مطار شرم الشيخ الدولي', cityName: 'شرم الشيخ', cityCode: 'SSH', countryCode: 'EG', countryName: 'مصر', regionName: 'Africa' },
  ),
  HRG: airport(
    { airportCode: 'HRG', airportName: 'Hurghada International Airport', cityName: 'Hurghada', cityCode: 'HRG', countryCode: 'EG', countryName: 'Egypt', regionName: 'Africa' },
    { airportCode: 'HRG', airportName: 'مطار الغردقة الدولي', cityName: 'الغردقة', cityCode: 'HRG', countryCode: 'EG', countryName: 'مصر', regionName: 'Africa' },
  ),
  DXB: airport(
    { airportCode: 'DXB', airportName: 'Dubai International Airport', cityName: 'Dubai', cityCode: 'DXB', countryCode: 'AE', countryName: 'United Arab Emirates', regionName: 'Asia' },
    { airportCode: 'DXB', airportName: 'مطار دبي الدولي', cityName: 'دبي', cityCode: 'DXB', countryCode: 'AE', countryName: 'الإمارات العربية المتحدة', regionName: 'Asia' },
  ),
  AUH: airport(
    { airportCode: 'AUH', airportName: 'Abu Dhabi International Airport', cityName: 'Abu Dhabi', cityCode: 'AUH', countryCode: 'AE', countryName: 'United Arab Emirates', regionName: 'Asia' },
    { airportCode: 'AUH', airportName: 'مطار أبوظبي الدولي', cityName: 'أبوظبي', cityCode: 'AUH', countryCode: 'AE', countryName: 'الإمارات العربية المتحدة', regionName: 'Asia' },
  ),
  KWI: airport(
    { airportCode: 'KWI', airportName: 'Kuwait International Airport', cityName: 'Kuwait', cityCode: 'KWI', countryCode: 'KW', countryName: 'Kuwait', regionName: 'Asia' },
    { airportCode: 'KWI', airportName: 'مطار الكويت الدولي', cityName: 'الكويت', cityCode: 'KWI', countryCode: 'KW', countryName: 'الكويت', regionName: 'Asia' },
  ),
  SHJ: airport(
    { airportCode: 'SHJ', airportName: 'Sharjah International Airport', cityName: 'Sharjah', cityCode: 'SHJ', countryCode: 'AE', countryName: 'United Arab Emirates', regionName: 'Asia' },
    { airportCode: 'SHJ', airportName: 'مطار الشارقة الدولي', cityName: 'الشارقة', cityCode: 'SHJ', countryCode: 'AE', countryName: 'الإمارات العربية المتحدة', regionName: 'Asia' },
  ),
  MCT: airport(
    { airportCode: 'MCT', airportName: 'Muscat International Airport', cityName: 'Muscat', cityCode: 'MCT', countryCode: 'OM', countryName: 'Oman', regionName: 'Asia' },
    { airportCode: 'MCT', airportName: 'مطار مسقط الدولي', cityName: 'مسقط', cityCode: 'MCT', countryCode: 'OM', countryName: 'عمان', regionName: 'Asia' },
  ),
  BAH: airport(
    { airportCode: 'BAH', airportName: 'Bahrain International Airport', cityName: 'Bahrain', cityCode: 'BAH', countryCode: 'BH', countryName: 'Bahrain', regionName: 'Asia' },
    { airportCode: 'BAH', airportName: 'مطار البحرين الدولي', cityName: 'البحرين', cityCode: 'BAH', countryCode: 'BH', countryName: 'البحرين', regionName: 'Asia' },
  ),
  DOH: airport(
    { airportCode: 'DOH', airportName: 'Hamad International Airport', cityName: 'Doha', cityCode: 'DOH', countryCode: 'QA', countryName: 'Qatar', regionName: 'Asia' },
    { airportCode: 'DOH', airportName: 'مطار حمد الدولي', cityName: 'الدوحة', cityCode: 'DOH', countryCode: 'QA', countryName: 'قطر', regionName: 'Asia' },
  ),
  LHR: airport(
    { airportCode: 'LHR', airportName: 'London Heathrow Airport', cityName: 'London', cityCode: 'LHR', countryCode: 'GB', countryName: 'United Kingdom', regionName: 'Europe' },
    { airportCode: 'LHR', airportName: 'مطار لندن هيثرو', cityName: 'لندن', cityCode: 'LHR', countryCode: 'GB', countryName: 'المملكة المتحدة', regionName: 'Europe' },
  ),
  RUH: airport(
    { airportCode: 'RUH', airportName: 'King Khalid International Airport', cityName: 'Riyadh', cityCode: 'RUH', countryCode: 'SA', countryName: 'Saudi Arabia', regionName: 'Asia' },
    { airportCode: 'RUH', airportName: 'مطار الملك خالد الدولي', cityName: 'الرياض', cityCode: 'RUH', countryCode: 'SA', countryName: 'السعودية', regionName: 'Asia' },
  ),
  JED: airport(
    { airportCode: 'JED', airportName: 'King Abdulaziz International Airport', cityName: 'Jeddah', cityCode: 'JED', countryCode: 'SA', countryName: 'Saudi Arabia', regionName: 'Asia' },
    { airportCode: 'JED', airportName: 'مطار الملك عبدالعزيز الدولي', cityName: 'جدة', cityCode: 'JED', countryCode: 'SA', countryName: 'السعودية', regionName: 'Asia' },
  ),
  DMM: airport(
    { airportCode: 'DMM', airportName: 'King Fahd International Airport', cityName: 'Dammam', cityCode: 'DMM', countryCode: 'SA', countryName: 'Saudi Arabia', regionName: 'Asia' },
    { airportCode: 'DMM', airportName: 'مطار الملك فهد الدولي', cityName: 'الدمام', cityCode: 'DMM', countryCode: 'SA', countryName: 'السعودية', regionName: 'Asia' },
  ),
  DAM: airport(
    { airportCode: 'DAM', airportName: 'Damascus International Airport', cityName: 'Damascus', cityCode: 'DAM', countryCode: 'SY', countryName: 'Syria', regionName: 'Asia' },
    { airportCode: 'DAM', airportName: 'مطار دمشق الدولي', cityName: 'دمشق', cityCode: 'DAM', countryCode: 'SY', countryName: 'سوريا', regionName: 'Asia' },
  ),
  BEY: airport(
    { airportCode: 'BEY', airportName: 'Beirut Rafic Hariri International Airport', cityName: 'Beirut', cityCode: 'BEY', countryCode: 'LB', countryName: 'Lebanon', regionName: 'Asia' },
    { airportCode: 'BEY', airportName: 'مطار بيروت رفيق الحريري الدولي', cityName: 'بيروت', cityCode: 'BEY', countryCode: 'LB', countryName: 'لبنان', regionName: 'Asia' },
  ),
  BGW: airport(
    { airportCode: 'BGW', airportName: 'Baghdad International Airport', cityName: 'Baghdad', cityCode: 'BGW', countryCode: 'IQ', countryName: 'Iraq', regionName: 'Asia' },
    { airportCode: 'BGW', airportName: 'مطار بغداد الدولي', cityName: 'بغداد', cityCode: 'BGW', countryCode: 'IQ', countryName: 'العراق', regionName: 'Asia' },
  ),
  CMN: airport(
    { airportCode: 'CMN', airportName: 'Mohammed V International Airport', cityName: 'Casablanca', cityCode: 'CMN', countryCode: 'MA', countryName: 'Morocco', regionName: 'Africa' },
    { airportCode: 'CMN', airportName: 'مطار محمد الخامس الدولي', cityName: 'الدار البيضاء', cityCode: 'CMN', countryCode: 'MA', countryName: 'المغرب', regionName: 'Africa' },
  ),
  RAK: airport(
    { airportCode: 'RAK', airportName: 'Marrakesh Menara Airport', cityName: 'Marrakesh', cityCode: 'RAK', countryCode: 'MA', countryName: 'Morocco', regionName: 'Africa' },
    { airportCode: 'RAK', airportName: 'مطار مراكش المنارة', cityName: 'مراكش', cityCode: 'RAK', countryCode: 'MA', countryName: 'المغرب', regionName: 'Africa' },
  ),
};

const CITY_TO_CODE: Record<string, string> = {
  cairo: 'CAI',
  alexandria: 'HBE',
  sharmelsheikh: 'SSH',
  sharmalsheikh: 'SSH',
  hurghada: 'HRG',
  hurgada: 'HRG',
  dubai: 'DXB',
  abudhabi: 'AUH',
  kuwait: 'KWI',
  kuwaitcity: 'KWI',
  alkuwayt: 'KWI',
  sharjah: 'SHJ',
  muscat: 'MCT',
  masqat: 'MCT',
  bahrain: 'BAH',
  manama: 'BAH',
  bahrsin: 'BAH',
  doha: 'DOH',
  london: 'LHR',
  riyadh: 'RUH',
  arriyad: 'RUH',
  jeddah: 'JED',
  jiddah: 'JED',
  jedda: 'JED',
  dammam: 'DMM',
  addammam: 'DMM',
  damascus: 'DAM',
  beirut: 'BEY',
  baghdad: 'BGW',
  bagdad: 'BGW',
  casablanca: 'CMN',
  marrakesh: 'RAK',
  marrakech: 'RAK',
};

function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

export interface IpLocationNames {
  city?: string | null;
  region?: string | null;
  country_capital?: string | null;
}

function matchCityName(city: string | null | undefined): IAirPortTranslated | null {
  if (!city) return null;
  const code = CITY_TO_CODE[normalizeCity(city)];
  return (code && LOCATION_AIRPORTS[code]) || null;
}

export function resolveDepartingAirport(location: IpLocationNames | string | null | undefined): IAirPortTranslated {
  const names = typeof location === 'string' || location == null
    ? [location]
    : [location.city, location.region, location.country_capital];

  for (const name of names) {
    const airport = matchCityName(name);
    if (airport) return airport;
  }

  return LOCATION_AIRPORTS['DXB'];
}
