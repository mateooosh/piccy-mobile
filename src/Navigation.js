import React from 'react';
import Register from './Register.js';
import LogIn from './LogIn.js';
import {NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator,} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import SettingsScreen from './screens/SettingsScreen.js';
import BottomTab from './BottomTab.js';
import ProfileScreen from './screens/ProfileScreen.js';
import PostScreen from './screens/PostScreen.js';
import FollowersScreen from './screens/FollowersScreen.js';
import FollowingScreen from './screens/FollowingScreen.js';
import EditProfileScreen from './screens/EditProfileScreen.js';

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
      return 'New Post'
    case 'messages':
      return 'My Messages';
    case 'account':
      return 'My Account';
  }
}


export default function Navigation() {
  const logged = useSelector(state => state.logged);

  const config = {
    screens: {
      Settings: 'settings',
      Profile: ':username',
      Post: 'post/:id',
      Followers: 'followers/:id',
      Following: 'following/:id',
      EditProfile: 'edit-profile',
      Home: '/',
    },
  };

  const linking = {
    prefixes: ['http://localhost:19006/'],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator headerMode="screen">
        {logged ? (
          <>
            <Stack.Screen
              name="Home" component={BottomTab}
              options={({route, navigation}) => ({
                headerTitle: getHeaderTitle(route),
                headerRight: () => (
                  <MaterialIcons onPress={() => navigation.push('Settings')} name="settings" color='black' size={30}/>
                ),
                headerRightContainerStyle: {
                  paddingRight: 15
                }
              })}
            />
            <Stack.Screen name="Settings" component={SettingsScreen}/>
            <Stack.Screen name="Profile" component={ProfileScreen}
                          options={({route}) => ({headerTitle: route.params.username})}/>
            <Stack.Screen name="Post" component={PostScreen} options={() => ({headerTitle: 'Post'})}/>
            <Stack.Screen name="Followers" component={FollowersScreen} options={() => ({headerTitle: 'Followers'})}/>
            <Stack.Screen name="Following" component={FollowingScreen} options={() => ({headerTitle: 'Following'})}/>
            <Stack.Screen name="EditProfile" component={EditProfileScreen}
                          options={() => ({headerTitle: 'Edit profile'})}/>
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
