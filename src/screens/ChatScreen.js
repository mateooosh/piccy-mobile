import React, {useState, useEffect, useRef} from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import {API_URL, API_URL_WS} from "@env";
import {useStore, useSelector} from "react-redux";
import {io} from "socket.io-client";
import MessageItem from "../components/MessageItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import colors from "../colors/colors";
import {t} from "../translations/translations";
import {checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

export default function ChatScreen({route, navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  const scrollViewRef = useRef();

  const [messages, setMessages] = useState([]);
  const [idChannel, setIdChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const refMessages = useRef(messages);

  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(io(API_URL_WS, {transports: ['websocket']}));

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

  useEffect(() => {
    refMessages.current = messages;
  }, [messages]);

  function findUserChattingWith(users) {
    return users.find(elem => elem.idUser != store.getState().id);
  }

  function markAsRead(idUser, idChannel) {
    socket.emit('mark-as-read', idUser, idChannel);
  }

  useEffect(() => {
    socket.on(`message-to-user-${store.getState().id}`, handler)

    const url = `${API_URL}/messages/${route.params.idUser}?myIdUser=${store.getState().id}&token=${store.getState().token}`;

    setIsLoading(true);

    fetch(url)
      .then(checkStatus)
      .then(response => {
        console.log('messages:', response);
        setMessages(response.messages);
        setIdChannel(response.idChannel);

        markAsRead(store.getState().id, response.idChannel);

        navigation.setOptions({
          headerTitle: () => (
            <TouchableOpacity onPress={() =>
              navigation.navigate("Profile", {
                username: findUserChattingWith(response.users).username,
              })
            } style={{flexDirection: 'row', alignItems: 'center'}}>
              {findUserChattingWith(response.users).photo ? (
                <Image
                  source={{uri: findUserChattingWith(response.users).photo}}
                  style={{width: 40, height: 40, borderRadius: 50, marginRight: 10}}
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
      .catch(checkError)
      .finally(() => setIsLoading(false))

    return () => {
      socket.off(`message-to-user-${store.getState().id}`, handler);
    }
  }, [])

  function handler(response) {
    console.log('message-to-user', response);

    let deepCopy = JSON.parse(JSON.stringify(refMessages.current));
    deepCopy.unshift(response);
    setMessages(deepCopy);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true})
    }, 100)

    markAsRead(store.getState().id, response.idChannel);
  }

  function send() {
    console.log('send');

    const obj = {
      message: message,
      idSender: store.getState().id,
      idReciever: route.params.idUser,
      idChannel: idChannel,
      createdAt: new Date(),
      usernameSender: store.getState().username
    }

    let deepCopy = JSON.parse(JSON.stringify(messages));
    deepCopy.unshift(obj);
    setMessages(deepCopy);

    socket.emit('message-from-user', obj);

    setTimeout(() => {
      scrollViewRef.current.scrollToEnd({animated: true})
    }, 100)

    setMessage('');
  }

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView ref={scrollViewRef} style={{paddingHorizontal: 10}} keyboardShouldPersistTaps='always' onLayout={() => scrollViewRef.current.scrollToEnd({animated: true})}>
        <View style={{display: 'flex', flexDirection: 'column-reverse'}}>
          {!isLoading && messages.map((mes, idx) =>
            <MessageItem key={idx} item={mes} navigation={navigation}/>
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
          placeholder={t.typeHere[lang]}
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
