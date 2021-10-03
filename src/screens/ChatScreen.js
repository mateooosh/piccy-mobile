import React, {useState, useEffect, useRef} from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator, Dimensions
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import MessageItem from "../components/MessageItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../colors/colors";
import {useToast} from "native-base";

export default function ChatScreen({route, navigation}) {
  const store = useStore();
  const toast = useToast();

  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([]);
  const [idChannel, setIdChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const refMessages = useRef(messages);

  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(io(API_URL_WS, {transports: ['websocket']}));

  useEffect(() => {
    refMessages.current = messages;
  }, [messages]);

  function findUserChattingWith(users) {
    return users.find(elem => elem.idUser != store.getState().id);
  }

  useEffect(() => {
    socket.on(`message-to-user-${store.getState().id}`, handler)

    const url = `${API_URL}/messages/${route.params.idUser}?myIdUser=${store.getState().id}&token=${store.getState().token}`;

    setIsLoading(true);

    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log('messages:', response);
        setMessages(response.messages);
        setIdChannel(response.idChannel);

        // navigation.setOptions({headerTitle: findUserChattingWith(response.users).username});

        navigation.setOptions({
          headerTitle: () => (
            <TouchableOpacity onPress={() =>
              navigation.navigate("Profile", {
                username: findUserChattingWith(response.users).username,
              })
            } style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              {findUserChattingWith(response.users).photo ? (
                <Image
                  source={{uri: findUserChattingWith(response.users).photo}}
                  style={{width: 40, height: 40, borderRadius: 50}}
                />
              ) : (
                <MaterialIcons name="account-circle" color={"black"} size={40}/>
              )}

              <Text style={{fontWeight: '700', fontSize: 15}}>{findUserChattingWith(response.users).username}</Text>
            </TouchableOpacity>
          )
        });

        setTimeout(() => {
          scrollViewRef.current.scrollToEnd({animated: false})
        }, 0)
      })
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false))

    return () => {
      socket.off(`message-to-user-${store.getState().id}`, handler);
    }
  }, [])

  function handler(response) {
    console.log('message-to-user', response);


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
      idReciever: route.params.idUser,
      idChannel: idChannel,
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
      <ScrollView ref={scrollViewRef} style={{paddingHorizontal: 10}}>
        <View>
          {!isLoading && messages.map((mes, idx) =>
            <MessageItem key={idx} item={mes}/>
          )}

          {isLoading &&
          <ActivityIndicator size={60} color={colors.primary} style={{marginVertical: 40}}/>
          }
        </View>
      </ScrollView>


      {!isLoading &&
      <View style={{position: 'relative', margin: 10}}>
        <TextInput
          onChangeText={str => setMessage(str)}
          onSubmitEditing={send}
          style={{
            minHeight: 46,
            flexGrow: 1,
            backgroundColor: '#eee',
            paddingLeft: 16,
            paddingRight: 50,
            fontSize: 16,
            borderRadius: 12,
            paddingVertical: 8,
          }}
          placeholder="Type here..."
          value={message}
        />
        <TouchableOpacity style={{position: 'absolute', right: 10, top: 5}}
                          onPress={send}>
          <MaterialIcons name="send" color={'#444'} size={35}/>
        </TouchableOpacity>
      </View>
      }
    </View>
  );
}
