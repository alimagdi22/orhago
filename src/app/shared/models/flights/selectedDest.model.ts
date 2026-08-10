import { IAirPort, IAirPortTranslated } from '../../../core/models/airport.model';

export interface ISelectedDest {
  departingCity: IAirPort | null | undefined;
  landingCity: IAirPort | null | undefined;
}
