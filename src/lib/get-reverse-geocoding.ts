import APIkey from '../constants/api-key';
import {first} from 'lodash-fp';
export const getReverseGeocoding = async (coordinates: Coordinates) => {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates?.latitude}+${coordinates?.longitude}&key=${APIkey}`;
    const res = await fetch(url);
    const data = await res.json();
    const {formatted} = first(data?.results);
    const {geometry} = first(data?.results);

    return {
      adresse: formatted,
      coordinates: {
        longitude: geometry?.lng,
        latitude: geometry?.lat,
      },
    };
  } catch (error) {
    console.log(error);
  }
};
