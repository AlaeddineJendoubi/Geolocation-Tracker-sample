import React from 'react';
import {Icon, ListItem} from '@ui-kitten/components';
import {DeleteLocationButton} from './delete-location-button';

const renderItemIcon = (props: any) => <Icon {...props} name="pin-outline" />;

export const LocationItem = ({item, index}) => (
  <ListItem
    title={`${item?.adresse} ${index + 1}`}
    description={`${item?.date} ${index + 1}`}
    accessoryLeft={renderItemIcon}
    accessoryRight={() => DeleteLocationButton(item?.id)}
  />
);
