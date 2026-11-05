import { IAirItinerary } from 'rp-travel-ui';


export interface FareFlightView {
  airlineName: string;
  airlineCode: string;
  flightNo: string;
  departAt: string;
  departCode: string;
  arriveAt: string;
  arriveCode: string;
  elapsedMinutes: number;
  stops: number;
}

export function fareFlightStorageKey(
  sid: string,
  sequenceNum: string | number,
  providerKey: string,
  pcc: string,
): string {
  return `fareFlight:${sid}${sequenceNum}${providerKey}${pcc}`;
}

export function fareFlightFromItinerary(itinerary: IAirItinerary | null | undefined): FareFlightView | null {
  const flight = itinerary?.allJourney?.flights?.[0];
  const segments = flight?.flightDTO;
  const first = segments?.[0];
  const last = segments?.[segments.length - 1];
  if (!flight || !first || !last) {
    return null;
  }

  const code = flight.flightAirline?.airlineCode || '';
  const number = String(first.flightInfo?.flightNumber || '');
  const bare = number.toUpperCase().startsWith(code.toUpperCase()) ? number.slice(code.length).trim() : number;

  return {
    airlineName: flight.flightAirline?.airlineName || code,
    airlineCode: code.slice(0, 2).toUpperCase(),
    flightNo: `${code} ${bare}`.trim(),
    departAt: first.departureDate,
    departCode: first.departureTerminalAirport?.airportCode || '',
    arriveAt: last.arrivalDate,
    arriveCode: last.arrivalTerminalAirport?.airportCode || '',
    elapsedMinutes: Number(flight.elapsedTime) || 0,
    stops: Number(flight.stopsNum) || 0,
  };
}
