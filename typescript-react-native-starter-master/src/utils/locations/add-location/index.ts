import cuid from 'cuid';
export const addLocation = (state, action) => {
  return {
    ...state,
    locations: [
      {
        ...action?.payload,
        id: cuid(),
        date: String(new Date()),
      },
      ...state?.locations,
    ],
  };
};
