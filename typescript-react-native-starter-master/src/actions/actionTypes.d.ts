import {ActionType} from 'typesafe-actions';
import * as appActions from './appActions';
import * as usersActions from './usersActions';
import * as locationsActions from './locations-actions';
export type AppAction = ActionType<typeof appActions>;
export type UsersAction = ActionType<typeof usersActions>;
export type LocationAction = ActionType<typeof locationsActions>;
export type RootAction = AppAction | UsersAction;
