import {call, delay, put, race, take, takeLatest} from 'redux-saga/effects';
import {fetchLocationAsync} from 'src/actions/location-actions';
import {getReverseGeocoding} from 'src/lib/get-reverse-geocoding';

export function* fetchReversedGeocodingSaga(action: ReturnType<typeof fetchLocationAsync.request>) {
  try {
    const {response} = yield race({
      response: call(getReverseGeocoding, action.payload),
      cancel: take(fetchLocationAsync.cancel),
      failed: take(fetchLocationAsync.failure),
      timeout: delay(60000),
    });

    yield put(fetchLocationAsync.success(response));
  } catch (error) {
    yield put(fetchLocationAsync.failure(error));
  }
}

export default function* root() {
  yield takeLatest(fetchLocationAsync.request, fetchReversedGeocodingSaga);
}
