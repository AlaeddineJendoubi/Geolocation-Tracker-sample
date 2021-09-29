'use strict';
import {
  fetchLocationAsync,
  deleteAllLocationsAction,
  deleteLocationAction,
} from 'src/actions/locations-actions';
import {Location} from 'src/types';
import {createReducer} from 'typesafe-actions';
import {LocationAction} from 'src/actions/actionTypes';
import {deleteLocation, addLocation} from '../utils/locations';

export interface LocationState {
  locations?: Location[];
}

const initialState: LocationState = {
  locations: [],
};

const locationReducer = createReducer<LocationState, LocationAction>(initialState)
  .handleAction(fetchLocationAsync.success, (state, action) => addLocation(state, action))
  .handleAction(deleteAllLocationsAction, (state, action) => ({
    ...state?.locations,
    locations: action?.payload,
  }))
  .handleAction(deleteLocationAction, (state, action) => ({
    ...state?.locations,
    locations: deleteLocation(state?.locations, action?.payload?.locationId),
  }));

export default locationReducer;
