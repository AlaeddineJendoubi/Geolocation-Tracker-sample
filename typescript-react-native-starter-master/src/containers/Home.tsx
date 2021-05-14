import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {NativeModules, NativeEventEmitter} from 'react-native';
import Colors from 'src/constants/colors';
import useSelector from 'src/utils/useSelector';
import {first} from 'lodash/fp';
import {Locationslist} from '../components/locations-list/index';
import {fetchLocationAsync, deleteAllLocationsAction} from '../actions/locations-actions';
import {Text, Icon, Button} from '@ui-kitten/components';
import {useDispatch} from 'react-redux';
import {isNil} from 'lodash';
import {Coordinates} from 'src/types';
function Home() {
  // ************ Hooks initialisation ************************
  const {locations} = useSelector((state) => state?.locations);
  const {t} = useTranslation();
  const dispatch = useDispatch();

  // ************ Actions dispatch  ************************
  /**
   * Makes a call to https://opencagedata.com/api and updates location state with the a new location
   * @param {Coordinates} coordinates current location coordinates
   * @returns {LocationState} a location state updated with new location
   */
  const fetchLocation = (coordinates: Coordinates) => {
    dispatch(fetchLocationAsync.request(coordinates));
  };

  /**
   * Deletes all locations in state
   * @returns {[]} an empty array
   */
  const deleteLocation = () => {
    dispatch(deleteAllLocationsAction());
  };

  // ************ Native module Initialisation   ************************

  // Init Aaqua location manager Native module
  const {AaqualocationManager} = NativeModules;
  // Init an event emitter for events coming from AaqualocationManager
  const locationEventEmitter = new NativeEventEmitter(AaqualocationManager);
  // Request Localisation accees
  AaqualocationManager?.requestAuthorization();
  // Start Listening on location updates
  AaqualocationManager?.startObserving({});
  locationEventEmitter.addListener('geolocationDidChange', (info) => fetchLocation(info));
  // Limit locations update to 30 locations
  if (locations?.length >= 30) {
    AaqualocationManager?.stopObserving();
  }
  // Init a no location object to display when locations state is null
  const noLocationRegisterd = {
    adresse: 'No Registered Locations ',
    id: 'null',
    coordinates: {longitude: 0, latitude: 0},
    date: 'Please make sure that internet/location ervices are on',
  };
  return (
    <View style={styles?.container}>
      <View style={styles?.titleContainer}>
        <Text style={styles?.title} category="h5">
          {t('title')}
        </Text>
      </View>
      <Text appearance="hint"> {t('recentLocation')}</Text>

      <View style={styles?.currentLocationContainer}>
        <View>
          <Icon style={styles.icon} fill="#000000" name="person-outline" />
        </View>
        <View style={styles?.currentLocationSubcontainer}>
          <Text appearance="default" category="h6" style={styles?.adresse}>
            {isNil(first(locations)?.adresse)
              ? noLocationRegisterd?.adresse
              : first(locations)?.adresse}
          </Text>
          <Text style={styles?.date} appearance="hint">
            {isNil(first(locations)?.date) ? noLocationRegisterd?.date : first(locations)?.date}
          </Text>
        </View>
      </View>
      <Text appearance="hint"> {t('previousLocation')}</Text>

      <View style={styles?.previouslocationContainer}>
        <Locationslist locations={locations} />
      </View>
      <Button size="medium" status="danger" onPress={() => deleteLocation()}>
        {t('deleteAll')}
      </Button>
    </View>
  );
}

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: Colors?.white,
  },
  titleContainer: {
    flex: 0.5,
    marginTop: 5,
  },
  title: {
    textAlign: 'center',
  },
  currentLocationContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
  currentLocationSubcontainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
  },
  previouslocationContainer: {
    flex: 10,
    marginTop: 5,
  },
  icon: {
    marginTop: 5,
    width: 50,
    height: 50,
  },
  date: {
    flex: 1,
    marginTop: 3,
    fontSize: 12,
  },
  adresse: {
    maxWidth: '80%',
    flex: 1,
    flexShrink: 1,
    fontSize: 13,
  },
});
