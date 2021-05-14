export const getReverseGeocoding = async (coordinates: Coordinates) => {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${coordinates?.latitude}+${coordinates?.longitude}&key=d2cb40387ab9405faa7d05abf318e307`;
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
