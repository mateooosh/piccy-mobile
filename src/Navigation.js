import React from 'react';

import {NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {t} from './translations/translations';

import RegisterScreen from './screens/RegisterScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import SettingsScreen from './screens/SettingsScreen.js';
import BottomTab from './BottomTab.js';
import ProfileScreen from './screens/ProfileScreen.js';
import PostScreen from './screens/PostScreen.js';
import FollowersScreen from './screens/FollowersScreen.js';
import FollowingScreen from './screens/FollowingScreen.js';
import EditProfileScreen from './screens/EditProfileScreen.js';
import ChatScreen from './screens/ChatScreen.js';
import ResetPasswordScreen from './screens/ResetPasswordScreen.js';
import ReportBugScreen from './screens/ReportBugScreen.js';
import LanguageScreen from './screens/LanguageScreen.js';

const Stack = createStackNavigator();


function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Piccy':
      return 'Piccy'
    case 'search':
      return 'Search'
    case 'create-post':
      return 'Create new post'
    case 'messages':
      return 'Messages';
    case 'account':
      return 'Account';
  }
}


export default function Navigation() {
  const logged = useSelector(state => state.logged);
  const lang = useSelector(state => state.lang);

  const config = {
    screens: {
      Register: 'register',
      Settings: 'settings',
      Profile: ':username',
      Post: 'post/:id',
      Followers: 'followers/:id',
      Following: 'following/:id',
      EditProfile: 'edit/profile',
      ResetPassword: 'reset/password',
      ReportBug: 'report/bug',
      Channel: 'chat/:idUser',
      Language: 'language',
      Piccy: '/',
    },
  };

  const linking = {
    prefixes: ['http://localhost:19006/'],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator headerMode="float">
        {logged ? (
          <>
            <Stack.Screen
              name="Piccy" component={BottomTab}
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
                          options={() => ({headerTitle: 'Edit Profile'})}/>
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}
                          options={() => ({headerTitle: t.resetPassword[lang]})}/>
            <Stack.Screen name="ReportBug" component={ReportBugScreen}
                          options={() => ({headerTitle: 'Report Bug'})}/>
            <Stack.Screen name="Channel" component={ChatScreen}
                          options={() => ({
                            headerTitle: 'Chat',
                            headerRight: () => (
                              <MaterialCommunityIcons name="dots-vertical" color='black'
                                                      size={30}/>
                            ),
                            headerRightContainerStyle: {
                              paddingRight: 15
                            }
                          })}/>
            <Stack.Screen name="Language" component={LanguageScreen}
                          options={() => ({
                            headerTitle: t.language[lang]
                          })}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Piccy" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
          </>
        )
        }
      </Stack.Navigator>
    </NavigationContainer>
  )
}
