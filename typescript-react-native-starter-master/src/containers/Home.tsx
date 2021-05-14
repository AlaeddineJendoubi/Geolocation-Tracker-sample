import React, {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import Colors from 'src/constants/colors';
import useSelector from 'src/utils/useSelector';

function Home() {
  const {locations} = useSelector((state) => state?.locations);
  const {t} = useTranslation();

  return <View style={styles?.container} />;
}

export default memo(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: Colors?.white,
  },
});
