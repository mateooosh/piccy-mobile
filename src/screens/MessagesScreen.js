import React, {useState, useEffect, useRef} from "react";
import {
  View,
  ScrollView,
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import MessageUserItem from "../components/MessageUserItem";
import {Divider} from 'react-native-elements';

export default function MessagesScreen({route, navigation}) {
  const store = useStore();

  const [channels, setChannels] = useState([]);

  useEffect(() => {
    getMessages();

    const socket = io(API_URL_WS, {transports: ['websocket']});
    socket.on(`message-to-user-${store.getState().id}`, getMessages);

  }, [])

  function getMessages() {
    const url = `${API_URL}/channels?idUser=${store.getState().id}&token=${store.getState().token}`;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setChannels(response);
      })
      .catch(err => console.log(err));
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

      </ScrollView>
    </View>
  );
}
