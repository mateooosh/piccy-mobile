import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/Navigation.js';
import { Provider } from 'react-redux';
import store from './store/store.js';
import colors from './src/colors/colors'

import { NativeBaseProvider } from "native-base";

export default function App() {

  // store.dispatch({ type: "logged/true" });
  // console.log(store.getState().logged);
  // const logged = useSelector(state => state.logged);
  // store.subscribe(handle);

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <Navigation />
        <StatusBar backgroundColor={colors.primary}/>
      </Provider>
    </NativeBaseProvider>
  );
}



