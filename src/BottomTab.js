
import React from 'react';
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


export default function BottomTab(props){
  console.log('asdadasdasd', props)
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
            <MaterialIcons name="home" color={color} size={26}/>
          ),
          title: "Piccy",
        }}
        name="Piccy"
        component={HomeScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="search" color={color} size={26}/>
          ),
          title: t.search[lang]
        }}
        name="search"
        component={SearchScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="add-circle" color={color} size={26}/>
          ),
          title: t.createPost[lang]
        }}
        name="create-post"
        component={AddScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="message" color={color} size={26}/>
          ),
          tabBarBadge: notificationAmount ? notificationAmount : null,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: 'white'
          },
          title: t.messages[lang]
        }}
        name="messages"
        component={MessagesScreen}
      />

      <Tab.Screen
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="account-circle" color={color} size={26}/>
          ),
          title: t.account[lang]
        }}
        name="account"
        component={AccountScreen}
      />
    </Tab.Navigator>
  )
}




