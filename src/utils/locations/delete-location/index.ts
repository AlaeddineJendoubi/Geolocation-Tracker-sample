import {filter} from 'lodash-fp';
import {LocationState} from 'src/reducers/locations-reducer';
import {Location} from 'src/types';

export const deleteLocation = (locations: LocationState, id: string) => {
  return filter((location: Location) => location.id !== id, locations);
};
