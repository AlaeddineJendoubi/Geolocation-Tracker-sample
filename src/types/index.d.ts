declare module 'redux-persist/lib/*';

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}
export interface Location {
  id: string;
  adresse: string;
  date: string;
  coordinates: Coordinates;
}

export interface LocationState {
  locations?: Location[];
}
