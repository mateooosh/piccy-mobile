import React, {useState, useEffect, useRef} from "react";
import {
  View,
  ScrollView,
  Text, TextInput, TouchableOpacity, Image
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import MessageItem from "../components/MessageItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function ChatScreen({route, navigation}) {
  const store = useStore();

  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([]);
  const refMessages = useRef(messages);
  const [userChattingWith, setUserChattingWith] = useState({});

  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(io('ws://localhost:3000', {transports: ['websocket']}));

  useEffect(() => {
    refMessages.current = messages;
  }, [messages]);

  function findUserChattingWith(users) {
    return users.find(elem => elem.idUser != store.getState().id);
  }

  useEffect(() => {

    const url = `${API_URL}/messages/${route.params.idChannel}`;

    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('messages:', response);
        setMessages(response.messages);

        console.log();
        // navigation.setOptions({headerTitle: findUserChattingWith(response.users).username});

        navigation.setOptions({
          headerTitle: () => (
            <TouchableOpacity onPress={() =>
              navigation.navigate("Profile", {
                username: findUserChattingWith(response.users).username,
              })
            } style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <Image
                source={{uri: findUserChattingWith(response.users).photo}}
                style={{width: 40, height: 40, borderRadius: 50}}
              />
              <Text style={{fontWeight: '700', fontSize: 15}}>{findUserChattingWith(response.users).username}</Text>
            </TouchableOpacity>
          )
        });

        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({animated: true})
        }, 0)
      })
      .catch(err => console.log(err));

    socket.on('message-from-server', handler)

    return () => {
      socket.off('message-from-server', handler);
    }
  }, [])

  function handler(response) {
    console.log('message-from-server', response);


    let deepCopy = JSON.parse(JSON.stringify(refMessages.current));
    deepCopy.push(response);
    setMessages(deepCopy);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true})
    }, 100)

  }

  function send() {
    console.log('send');

    const obj = {
      message: message,
      idSender: store.getState().id,
      idChannel: route.params.idChannel,
      createdAt: new Date()
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
      <ScrollView ref={scrollViewRef} style={{paddingHorizontal: 10, paddingBottom: 10}}>
        <View>
          {messages.map((mes, idx) =>
            // <Text style={{padding: 50}} key={idx}>{mes.message}</Text>
            <MessageItem key={idx} item={mes}/>
          )}
        </View>
      </ScrollView>


      <View style={{position: 'relative', margin: 10}}>
        <TextInput
          onChangeText={str => setMessage(str)}
          onSubmitEditing={send}
          style={{
            backgroundColor: '#ddd',
            paddingHorizontal: 20,
            borderRadius: 15,
            fontSize: 16,
            minHeight: 46,
            flexGrow: 1
          }}
          placeholder="Type here..."
          value={message}
        />
        <TouchableOpacity style={{position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)'}}
                          onPress={send}>
          <MaterialIcons name="send" color={'#444'} size={35} style={{marginLeft: 20}}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}
