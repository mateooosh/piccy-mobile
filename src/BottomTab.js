
import React from 'react';
import {View, Text} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import {useStore, useSelector} from "react-redux";
import {t} from './translations/translations';

import colors from './colors/colors'


//import screens
import AddScreen from './screens/AddScreen.js';
import HomeScreen from './screens/HomeScreen.js';
import AccountScreen from './screens/AccountScreen.js';
import SearchScreen from './screens/SearchScreen.js';
import MessagesScreen from './screens/MessagesScreen.js';


export default function BottomTab(){
  const store = useStore();
  const lang = useSelector(state => state.lang);
  const notificationAmount = useSelector(state => state.notificationAmount);

  return(
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: 'black',
        showLabel: true,
        keyboardHidesTabBar: true,
        tabStyle: {
          paddingBottom: 2,
          paddingTop: 4
        }
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="home" color={color} size={30}/>
          ),
          title: "Piccy",
        }}
        name="Piccy"
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="search" color={color} size={30}/>
          ),
          title: t.search[lang]
        }}
        name="search"
        component={SearchScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="add-circle" color={color} size={30}/>
          ),
          title: t.createPost[lang]
        }}
        name="create-post"
        component={AddScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="message" color={color} size={30}/>
          ),
          tabBarBadge: notificationAmount ? notificationAmount : null,
          title: t.messages[lang]
        }}
        name="messages"
        component={MessagesScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="account-circle" color={color} size={30}/>
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



