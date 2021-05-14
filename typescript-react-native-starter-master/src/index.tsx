import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import App from 'src/App';
import {persistor, store} from 'src/store';
import NavigationService, {navigationRef} from './lib/NavigationService';
import './i18n';
import {enableScreens} from 'react-native-screens';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
/**
 * Optimize memory usage and performance: https://reactnavigation.org/docs/react-native-screens/
 */
enableScreens();

export default function Root() {
  useEffect(() => {
    NavigationService.isReady = false;
  }, []);
  return (
    <Provider store={store}>
      <IconRegistry icons={EvaIconsPack} />
      <PersistGate loading={<View />} persistor={persistor}>
        <ApplicationProvider {...eva} theme={eva.light}>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              NavigationService.isReady = true;
            }}>
            <App />
          </NavigationContainer>
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}
