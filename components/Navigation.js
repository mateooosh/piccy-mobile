
import React from 'react';
import Register from './Register.js';
import LogIn from './LogIn.js';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createStackNavigator,  } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SettingsScreen from './SettingsScreen.js';
import BottomTab from './BottomTab.js';


const Stack = createStackNavigator();


function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Home':
      return 'Home'
    case 'search':
      return 'Search'
    case 'add':
        return 'New post'
    case 'messages':
      return 'My messages';
    case 'account':
      return 'My account';
  }
}


export default function Navigation(){
  const logged = useSelector(state => state.logged);

  const config = {
    screens: {
      Settings: 'settings',
      Home: '/',
    },
  };

  const linking = {
    prefixes: ['http://localhost:19006/'],
    config,
  };

  return(
    <NavigationContainer linking={linking}>
      <Stack.Navigator headerMode="screen" >
        {logged ? (
            <>
              <Stack.Screen 
                name="Home" component={BottomTab} 
                options={({ route, navigation }) => ({
                  headerTitle: getHeaderTitle(route),
                  headerRight: () => (
                    <MaterialIcons onPress={()=>navigation.navigate('Settings')} name="settings" color='black' size={30}/>
                  ),
                  headerRightContainerStyle:{
                    paddingRight: 15
                  }
                })}
              />
              <Stack.Screen name="Settings" component={SettingsScreen}/>
            </>
          ) : (
            <>
              <Stack.Screen name="Home" component={LogIn}/>
              <Stack.Screen name="Register" component={Register}/>
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
