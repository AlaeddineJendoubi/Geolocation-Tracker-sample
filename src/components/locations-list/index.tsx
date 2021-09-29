import React from 'react';
import {List} from '@ui-kitten/components';
import {StyleSheet} from 'react-native';
import {LocationItem} from './locations-item';

export const Locationslist = (props: any) => {
  return <List style={styles.container} data={props?.locations} renderItem={LocationItem} />;
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
});
