import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useSelector, useStore} from "react-redux";
import {io} from "socket.io-client";
import {Divider} from 'react-native-elements';
import colors from '../colors/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {t} from "../translations/translations";
import styles from "../styles/style";
import {checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

export default function SharePostScreen({route, navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(io(API_URL_WS, {transports: ['websocket']}));


  useEffect(() => {
    getMessages();
  }, [])

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

  function checkError(err) {
    if (err.status == 405) {
      store.dispatch({type: 'resetStore'});
      Toast.show({
        type: 'error',
        text1: t.error[lang],
        text2: t.youHaveBeenLoggedOutBecauceOfToken[lang]
      });
    } else
      console.log(err);
  }

  function sharePost(idUser, idChannel) {
    // props.navigation.push('Profile', {username: item.username})
    console.log('share', idUser)

    const obj = {
      message: `LINKTOPOST|${route.params.id}`,
      idSender: store.getState().id,
      idReciever: idUser,
      idChannel: idChannel,
      createdAt: new Date()
    }

    console.log(obj)

    socket.emit('message-from-user', obj);

    navigation.push('Chat', {idUser: idUser})
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column'}}>
        {channels.map((item, idx) =>
          <View key={idx}
                style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginHorizontal: 15}}>

            {item.photo !== null &&
            <Image
              source={{uri: item.photo}}
              style={{width: 50, height: 50, borderRadius: 50, marginRight: 15}}
            />
            }
            {item.photo === null &&
            <MaterialIcons name="account-circle" color={'black'} size={50} style={{marginRight: 15}}/>
            }

            <View style={{flexGrow: 1}}>
              <Text
                style={{fontWeight: '700', fontSize: 15}}
              >
                {item.username}
              </Text>
              <Text style={{color: '#555'}}>
                {item.name}
              </Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={sharePost.bind(this, item.idUser, item.idChannel)}>
              <Text style={styles.button.text}>Send</Text>
            </TouchableOpacity>


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
