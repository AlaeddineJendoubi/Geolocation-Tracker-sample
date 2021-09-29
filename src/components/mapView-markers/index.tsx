import React from 'react';

import {Marker} from 'react-native-maps';
import {map} from 'lodash/fp';
import {LocationState, Location} from 'src/types';

/**
 * Maps the state locations and returns an array of marker componenets
 *  * @param {LocationState} locations locations state array
 * @returns {[]} an array of Marker Componenet
 */
export const Markers = (locations: LocationState) => {
  return map((location: Location) => {
    return (
      <Marker
        key={location?.id}
        coordinate={{
          longitude: location.coordinates?.longitude,
          latitude: location.coordinates?.latitude,
        }}
      />
    );
  }, locations);
};
