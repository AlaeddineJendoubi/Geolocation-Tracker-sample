import React from 'react';
import {Button} from '@ui-kitten/components';
import {useTranslation} from 'react-i18next';

export const DeleteLocationButton = (locationID:string) => {
  const {t} = useTranslation();
  const deleteLocationFromState = () => {
    console.log('deleted');
  };
  return <Button size="tiny" onPress={() => deleteLocationFromState()}>  {t('delete')}  </Button>;
};
