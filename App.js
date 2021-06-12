

import React from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/Navigation.js';
import { Provider } from 'react-redux';
import store from './store/store.js';



export default function App() {

  // store.dispatch({ type: "logged/true" });
  // console.log(store.getState().logged);
  // const logged = useSelector(state => state.logged);
  // store.subscribe(handle);

  return (
    <Provider store={store}>
      <Navigation/>
      <StatusBar backgroundColor="#2196F3" />
    </Provider>
  );
}



