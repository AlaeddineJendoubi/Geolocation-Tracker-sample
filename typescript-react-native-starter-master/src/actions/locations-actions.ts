import {createAsyncAction} from 'typesafe-actions';
import {Location, Coordinates} from 'src/types';

export const fetchLocationAsync = createAsyncAction(
  ['LOCATION_FETCH', (coordinates: Coordinates) => coordinates],
  ['LOCATION_FETCH_SUCCESS', (res: Location) => res],
  ['LOCATION_ERROR', (err: Error) => err],
  'LOCATION_FETCH_CANCEL',
)();
