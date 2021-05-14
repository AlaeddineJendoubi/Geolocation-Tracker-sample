import {deleteLocation} from '../index';
import {locationsStateMock} from '../../__mocks__/locations-state-mock';

test('Delete from provided location id from locations state', () => {
  expect(deleteLocation(locationsStateMock, '1')).toEqual([
    {
      adresse: '1 My adress @my streer name  ',
      id: '2',
      coordinates: {longitude: 36.835879, latitude: 10.157092},
      date: 'yesterday',
    },
    {
      adresse: '1 My adress @my streer name  ',
      id: '3',
      coordinates: {longitude: 36.835879, latitude: 10.157092},
      date: 'last week',
    },
    {
      adresse: '1 My adress @my streer name  ',
      id: '4',
      coordinates: {longitude: 36.835879, latitude: 10.157092},
      date: 'last year',
    },
  ]);
});
