import React, {useEffect, useRef, useState} from 'react';

import {NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useStore} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {API_URL, API_URL_WS} from '@env';

import colors from './colors/colors';

import {t} from './translations/translations';

import RegisterScreen from './screens/RegisterScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import SettingsScreen from './screens/SettingsScreen.js';
import BottomTab from './BottomTab.js';
import ProfileScreen from './screens/ProfileScreen.js';
import PostScreen from './screens/PostScreen.js';
import FollowersScreen from './screens/FollowersScreen.js';
import FollowingScreen from './screens/FollowingScreen.js';
import LikesScreen from './screens/LikesScreen.js';
import EditProfileScreen from './screens/EditProfileScreen.js';
import ChatScreen from './screens/ChatScreen.js';
import ResetPasswordScreen from './screens/ResetPasswordScreen.js';
import ReportBugScreen from './screens/ReportBugScreen.js';
import LanguageScreen from './screens/LanguageScreen.js';
import TagScreen from './screens/TagScreen.js';
import SharePostScreen from './screens/SharePostScreen.js';

import {io} from "socket.io-client";

import {useToast} from 'native-base';
import Toast, {BaseToast, ErrorToast, SuccessToast} from 'react-native-toast-message';
import styles from "./styles/style";
// import store from "../store/store";

const Stack = createStackNavigator();


export default function Navigation() {
  const store = useStore();
  const toast = useToast();

  const logged = useSelector(state => state.logged);
  const lang = useSelector(state => state.lang);
  const idUser = useSelector(state => state.id);
  const [socket, setSocket] = useState(null)


  useEffect(() => {
    const id = store.getState().id;
    const log = store.getState().logged
    const username = store.getState().username

    setSocket(io(API_URL_WS, {transports: ['websocket']}));

    if (log) {
      console.log('turn on: ', `message-to-user-${id}`)
      socket.emit('new-user', store.getState().username);
      socket.on(`message-to-user-${id}`, handler);
    }

    return function cleanup() {

      if (log) {
        console.log('turn off: ', `message-to-user-${id}`);
        socket.off(`message-to-user-${id}`, handler);
        console.log('log-out', username)
        socket.emit('log-out', username);
        // socket.off(`invalid-token-${id}`, handleInvalidToken)
        setSocket(null)
      }
    }
  }, [logged])

  const handler = (message) => {
    if (navigationRef.current?.getCurrentRoute().name !== 'messages' && navigationRef.current?.getCurrentRoute().name !== 'Chat') {
      Toast.show({
        type: 'base',
        text1: message.usernameSender,
        text2: message.message
      });
      store.dispatch({type: 'notificationAmountSet', payload: store.getState().notificationAmount + 1});
    }
  }

  function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route);

    switch (routeName) {
      case 'Piccy':
        'Piccy'
      case 'search':
        return t.search[lang]
      case 'create-post':
        return t.createNewPost[lang]
      case 'messages':
        return t.messages[lang]
      case 'account':
        return t.account[lang]
    }
  }

  const config = {
    screens: {
      Register: 'register',
      Settings: 'settings',
      Profile: ':username',
      Post: 'post/:id',
      Followers: 'followers/:id',
      Following: 'following/:id',
      Likes: 'likes/:idPost',
      EditProfile: 'edit/profile',
      ResetPassword: 'reset/password',
      ReportBug: 'report/bug',
      Chat: 'chat/:idUser',
      Language: 'language',
      Tag: 'tag/:tag',
      Share: 'share/:id',
      Piccy: '/'
    }
  };

  const linking = {
    prefixes: ['http://localhost:19006/'],
    config
  };

  const navigationRef = React.useRef(null);

  const toastConfig = {
    success: (props) => (
      <SuccessToast
        {...props}
        style={{borderLeftWidth: 10, borderLeftColor: '#00c900'}}
        // contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 16,
          fontWeight: '600'
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{borderLeftWidth: 10, borderLeftColor: 'red', ...styles.shadow}}
        text1Style={{
          fontSize: 16,
          fontWeight: '600'
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    ),
    base: (props) => (
      <BaseToast
        {...props}
        style={{borderLeftWidth: 10, borderLeftColor: colors.primary, ...styles.shadow}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 16,
          fontWeight: '600'
        }}
        text2Style={{
          fontSize: 12
        }}
      />
    )
  };

  return (
    <>
      <NavigationContainer linking={linking} ref={navigationRef}>
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
                  },
                })}
              />

              <Stack.Screen name="Settings" component={SettingsScreen}
                            options={() => ({headerTitle: t.settings[lang]})}/>
              <Stack.Screen name="Profile" component={ProfileScreen}
                            options={({route}) => ({headerTitle: route.params.username})}/>
              <Stack.Screen name="Post" component={PostScreen} options={() => ({headerTitle: 'Post'})}/>
              <Stack.Screen name="Followers" component={FollowersScreen}
                            options={() => ({headerTitle: t.followers2[lang]})}/>
              <Stack.Screen name="Following" component={FollowingScreen}
                            options={() => ({headerTitle: t.following2[lang]})}/>
              <Stack.Screen name="Likes" component={LikesScreen} options={() => ({headerTitle: t.likes2[lang]})}/>
              <Stack.Screen name="Share" component={SharePostScreen} options={() => ({headerTitle: 'Share post'})}/>
              <Stack.Screen name="EditProfile" component={EditProfileScreen}
                            options={() => ({headerTitle: t.editProfile[lang]})}/>
              <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}
                            options={() => ({headerTitle: t.resetPassword[lang]})}/>
              <Stack.Screen name="ReportBug" component={ReportBugScreen}
                            options={() => ({headerTitle: t.reportBug[lang]})}/>
              <Stack.Screen name="Chat" component={ChatScreen}
                            options={() => ({
                              headerTitle: '',
                              // headerRight: () => (
                              //   <MaterialCommunityIcons name="dots-vertical" color='black'
                              //                           size={30}/>
                              // ),
                              // headerRightContainerStyle: {
                              //   paddingRight: 15
                              // }
                            })}/>
              <Stack.Screen name="Language" component={LanguageScreen}
                            options={() => ({
                              headerTitle: t.language[lang]
                            })}/>
              <Stack.Screen name="Tag" component={TagScreen}
                            options={({route}) => ({
                              headerTitle: `#${route.params.tag}`
                            })}/>
            </>
          ) : (
            <>
              <Stack.Screen name="Piccy" component={LoginScreen}/>
              <Stack.Screen name="Register" component={RegisterScreen}
                            options={() => ({headerTitle: t.register[lang]})}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} position='bottom' bottomOffset={60}/>
    </>
  )
}
