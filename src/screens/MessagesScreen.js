import React, {useState, useEffect} from "react";
import {
  View,
  ScrollView, ActivityIndicator,
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import MessageUserItem from "../components/MessageUserItem";
import {Divider} from 'react-native-elements';
import colors from '../colors/colors';
import {useToast} from "native-base";
import {checkStatus, displayToast} from "../functions/functions";
import {t} from "../translations/translations";
import Toast from "react-native-toast-message";

export default function MessagesScreen({route, navigation}) {
  const store = useStore();

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const lang = useSelector(state => state.lang);


  useEffect(() => {
    getMessages();

    const socket = io(API_URL_WS, {transports: ['websocket']});
    socket.on(`message-to-user-${store.getState().id}`, getMessages);

    navigation.addListener('focus', () => {
      store.dispatch({type: 'notificationAmountSet', payload: 0});
      getMessages();
      return function cleanupListener() {
        window.removeEventListener('focus');
      }
    })

  }, [])

  const toast = useToast();

  function checkError(err) {
    if(err.status == 405) {
      store.dispatch({type: 'resetStore'});
      Toast.show({
        type: 'error',
        text1: t.error[lang],
        text2: t.youHaveBeenLoggedOutBecauceOfToken[lang]
      });
    }
    else
      console.log(err);
  }

  function getMessages() {
    const url = `${API_URL}/channels?idUser=${store.getState().id}&token=${store.getState().token}`;
    fetch(url)
      .then(checkStatus)
      .then(response => {
        console.log(response);
        setChannels(response);
      })
      .catch(checkError)
      .finally(() => setLoading(false));
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column'}}>
        {channels.map((channel, idx) =>
          <View key={idx}>
            <MessageUserItem navigation={navigation} channel={channel}></MessageUserItem>
            {idx !== channels.length - 1 &&
            <Divider color={'#ddd'}/>
            }
          </View>
        )}

        {loading &&
          <ActivityIndicator size={60} color={colors.primary} style={{marginVertical: 40}}/>
        }

      </ScrollView>
    </View>
  );
}
