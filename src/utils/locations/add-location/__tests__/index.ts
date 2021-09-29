import {addLocation} from '../index';
const state = {
  locations: [],
};
const newAction = {
  payload: {
    adresse: '1 My adress @my streer name  ',
    id: '2',
    coordinates: {longitude: 36.835879, latitude: 10.157092},
    date: 'yesterday',
  },
};

test('add new location to locations state', () => {
  expect(addLocation(state, newAction)).toEqual({
    adresse: '1 My adress @my streer name  ',
    id: '2',
    coordinates: {longitude: 36.835879, latitude: 10.157092},
    date: String(new Date()),
  });
});
