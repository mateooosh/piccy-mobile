import React, {useEffect, useState, useRef} from 'react';
import { StatusBar } from 'react-native';
import Navigation from './src/Navigation.js';
import { Provider } from 'react-redux';
import store from './store/store.js';
import colors from './src/colors/colors'

import { NativeBaseProvider } from "native-base";

// // notifications
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

export default function App() {



  //
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  //
  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  //
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });
  //
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });
  //
  //   // setTimeout(async () => {
  //   //   await schedulePushNotification();
  //   // }, 2000);
  //
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <Navigation />
        <StatusBar backgroundColor={colors.primary}/>
      </Provider>
    </NativeBaseProvider>
  );
}
//
// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got a message",
//       body: 'Server sent a message to you after 5 seconds',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 10 }
//   });
// }
//
// async function registerForPushNotificationsAsync() {
//   let token;
//   if (Constants.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }
//
//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
//
//   return token;
// }
//
//
//
