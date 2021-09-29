import {all} from 'redux-saga/effects';
import locations from './locations-sagas';
import users from './usersSagas';

export default function* root() {
  yield all([locations(), users()]);
}
