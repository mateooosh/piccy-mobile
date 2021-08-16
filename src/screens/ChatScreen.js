import React, {useState, useEffect, useRef} from "react";
import {
  View,
  ScrollView,
  Text, TextInput, TouchableOpacity
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import MessageItem from "../components/MessageItem";
import MessageUserItem from "../components/MessageUserItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ChatScreen({route, navigation}) {
  const store = useStore();

  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(io('ws://localhost:3000', {transports: ['websocket']}));

  useEffect(() => {

    // console.log(socket)

    socket.on('message-from-server', handler)

    return () => {
      socket.off('message-from-server', handler);
    }
  }, [messages])

  function handler(response) {
    console.log('message-from-server', response, messages);

    if (response.idUser != store.getState().id) {
      let deepCopy = JSON.parse(JSON.stringify(messages));
      console.log(deepCopy)
      deepCopy.push(response);
      setMessages(deepCopy);

      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({animated: true})
      }, 100)
    }
  }

  function send() {
    console.log('send');

    const obj = {
      message: message,
      idUser: store.getState().id,
      date: new Date()
    }

    let deepCopy = JSON.parse(JSON.stringify(messages));
    deepCopy.push(obj);
    setMessages(deepCopy);


    socket.emit('message-from-user', obj);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true})
    }, 100)

    setMessage('');
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView ref={scrollViewRef} style={{flexGrow: 1}}>
        <View>
          {messages.map((mes, idx) =>
            // <Text style={{padding: 50}} key={idx}>{mes.message}</Text>
            <MessageItem key={idx} item={mes}/>
          )}
        </View>
      </ScrollView>


      <View style={{position: 'relative', marginTop: 10}}>
        <TextInput
          onChangeText={str => setMessage(str)}
          onSubmitEditing={send}
          style={{backgroundColor: '#ddd', paddingHorizontal: 20, borderRadius: 15, fontSize: 16, minHeight: 46, flexGrow: 1}}
          placeholder="Type here..."
          value={message}
        />
        <TouchableOpacity style={{position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)'}} onPress={send}>
          <MaterialIcons name="send" color={'#444'} size={35} style={{ marginLeft: 20}}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}
