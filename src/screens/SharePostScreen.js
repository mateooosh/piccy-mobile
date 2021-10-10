import React, {useState, useEffect, useRef} from "react";
import {
  View,
  ScrollView, ActivityIndicator, TouchableOpacity, Image,
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import {Divider} from 'react-native-elements';
import colors from '../colors/colors';
import {Text} from "native-base";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {t} from "../translations/translations";
import styles from "../styles/style";

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
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setChannels(response);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }

  function sharePost (idUser, idChannel) {
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
            <View key={idx} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginHorizontal: 15}}>

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
