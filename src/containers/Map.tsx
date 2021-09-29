import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from 'src/constants/colors';
import MapView from 'react-native-maps';
import useSelector from 'src/utils/useSelector';
import {Markers} from '../components/mapView-markers';

import {first} from 'lodash/fp';

function Map() {
  const {locations} = useSelector((state) => state?.locations);
  const RenderMarkers = Markers(locations);

  return (
    <View style={styles?.container}>
      <MapView
        style={styles?.map}
        initialRegion={{
          latitude: first(locations)?.coordinates?.latitude,
          longitude: first(locations)?.coordinates?.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
      {RenderMarkers}
    </View>
  );
}

export default memo(Map);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: Colors?.darkCharcoal,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
