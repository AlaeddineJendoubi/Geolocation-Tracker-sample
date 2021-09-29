import React from 'react';
import {Button} from '@ui-kitten/components';
import {useTranslation} from 'react-i18next';
import {useDispatch} from 'react-redux';
import {deleteLocationAction} from "../../actions/locations-actions"




export const DeleteLocationButton = (locationID:string) => {
  
  // ************ Hooks initialisation ************************
  const {t} = useTranslation();
  const dispatch = useDispatch();

  // ************ Action dispatch  ************************
  /**
   * Deletes a locations by specifing it's id from the state
   * @returns {LocationState} a new location state array without the provided location
   */
  const deleteLocationFromState = () => {
    dispatch(deleteLocationAction(locationID));
  };
  return <Button size="tiny" onPress={() => deleteLocationFromState()}>  {t('delete')}  </Button>;
};


