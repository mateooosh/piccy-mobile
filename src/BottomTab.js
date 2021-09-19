
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import {useStore, useSelector} from "react-redux";
import {t} from './translations/translations';

import colors from './colors/colors'
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

//import screens
import AddScreen from './screens/AddScreen.js';
import HomeScreen from './screens/HomeScreen.js';
import AccountScreen from './screens/AccountScreen.js';
import SearchScreen from './screens/SearchScreen.js';
import MessagesScreen from './screens/MessagesScreen.js';


console.log(AddScreen)

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got a message",
//       body: 'Server sent a message to you after 5 seconds',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 10 },
//   });
// }

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

//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   return token;
// }

export default function BottomTab(){
  const lang = useSelector(state => state.lang);

  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   const socket = io(API_URL_WS, { transports : ['websocket']});
  //   socket.on('notification', async (data) => {
  //     console.log('not',data);
  //     await schedulePushNotification();
      
  //   })

  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });

  //   // setTimeout(async () => {
  //   //   await schedulePushNotification();
  //   // }, 2000);
 
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

  return(
    <Tab.Navigator  
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: 'black',
        showLabel: true,
        keyboardHidesTabBar: true,
        tabStyle: {
          paddingBottom: 2
        }
      }}
    >
      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={25}/>
          ),
          title: "Piccy",
        }} 
        name="Piccy"
        component={HomeScreen}
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="search" color={color} size={25}/>
          ),
          title: t.search[lang]
        }} 
        name="search" 
        component={SearchScreen}
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="add-circle" color={color} size={25}/>
          ),
          title: t.createPost[lang]
        }} 
        name="create-post"
        component={AddScreen} 
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="message" color={color} size={25}/>
          ),
          title: t.messages[lang]
        }} 
        name="messages" 
        component={MessagesScreen} 
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="account-circle" color={color} size={25}/>
          ),
          title: t.account[lang]
        }} 
        name="account" 
        component={AccountScreen} 
      />
    </Tab.Navigator>
  )
}

// function SearchScreen(){
//   const [query, setQuery] = useState('');

//   function getIcon(){
//     if(query.length > 0)
//       return <MaterialIcons onPress={() => setQuery('')} name="close" color={'black'} size={30} style={{position: 'absolute', right: 10, top:8}}/>;
//     else
//       return;
//   }

//   return (
//     <View style={{ flex: 1, justifyContent:'space-between' }}>
//       <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 10}}>
//         <TextInput 
//           onChangeText={(str) => setQuery(str)} 
//           style={{backgroundColor: '#ddd', paddingHorizontal: 20, borderRadius: 15, fontSize: 16, height: 46}}
//           placeholder="Type here..." 
//           value={query}
//         />
//         {getIcon()}
//       </View>
//       <TopTab.Navigator tabBarOptions={{
//           activeTintColor:'#2196F3',
//           inactiveTintColor: 'black',
//           style: { backgroundColor: '#f2f2f2' },
//         }}>
//         <TopTab.Screen name="accounts" children={()=><SearchAccounts query={query}/>}/>
//         <TopTab.Screen name="tags" children={()=><SearchTags query={query}/>}/>
//       </TopTab.Navigator>
      
//     </View>
//   )
// }



// function MessagesScreen(){
//   useEffect(() => {
//     // const socket = io(API_URL_WS, { transports : ['websocket']});
//
//     // socket.emit("new user", `User${Math.floor(Math.random() * 1000000)}`);
//   }, [])
//
//
//
//
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       {/* <Button
//         title="Press to schedule a notification"
//         onPress={async () => {
//           console.log('scheduled')
//           await schedulePushNotification();
//         }}
//       /> */}
//       <Text>Messages!</Text>
//     </View>
//   )
// }



