'use strict';
import {fetchLocationAsync} from 'src/actions/locations-actions';
import {Location} from 'src/types';
import {createReducer} from 'typesafe-actions';
import {LocationAction} from 'src/actions/actionTypes';
import cuid from 'cuid';

export interface LocationState {
  locations?: Location[];
}

const initialState: LocationState = {
  locations: [],
};

const locationReducer = createReducer<LocationState, LocationAction>(initialState).handleAction(
  fetchLocationAsync.success,
  (state, action) => ({
    ...state,
    locations: [
      {
        ...action?.payload,
        id: cuid(),
        date: String(new Date()),
      },
      ...state?.locations,
    ],
  }),
);

export default locationReducer;
