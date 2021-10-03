import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import {useStore} from "react-redux";
import colors from '../colors/colors';

import fun from '../functions/functions';
import {Collapse} from "native-base";


export default React.memo(MessageItem);

function MessageItem(props) {

  const store = useStore();

  const [item, setItem] = useState({});
  const [displayTime, setDisplayTime] = useState(false);

  useEffect(() => {
    setItem(props.item);
  }, [props])

  // function displayMessage(message, color) {
  //   let arr = []
  //   if(message) {
  //     arr = message.split(' ')
  //
  //     for(let i=0; i<arr.length; i++) {
  //       if(arr[i].startsWith('http')) {
  //         const link = arr[i];
  //         arr[i] = <Text onPress={async () => {
  //           if(await Linking.canOpenURL(link)) {
  //             await Linking.openURL(link);
  //           }
  //           else {
  //             alert(`Don't know how to open this URL: ${link}`);
  //           }
  //         }}
  //         style={{textDecoration: 'underline'}}>{arr[i]}</Text>
  //       }
  //     }
  //   }
  //   return arr.map((item, i) =>
  //     <Text key={i} style={{color: color, fontSize: 16, wordBreak: 'break-word'}}>{item} </Text>
  //   )
  // }


  return (
    <View>
      {item.idSender == store.getState().id && (
        <View style={{alignItems: 'flex-end'}}>
          <TouchableOpacity activeOpacity={1} onPress={() => setDisplayTime(!displayTime)} style={{
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: colors.primary,
            marginVertical: 5,
            textAlign: 'left'
          }}>
            <Text style={{
              color: 'white',
              fontSize: 16,
              maxWidth: Dimensions.get('window').width * 3 / 4
            }}>{item.message} </Text>
          </TouchableOpacity>

          <Collapse isOpen={displayTime}>
            <Text style={{
              marginHorizontal: 10,
              marginBottom: 5,
              fontSize: 12,
              color: '#999'
            }}>{fun.displayTimeV2(item.createdAt)}</Text>
          </Collapse>
        </View>
      )}

      {item.idSender != store.getState().id && (
        <View style={{alignItems: 'flex-start'}}>
          <TouchableOpacity activeOpacity={1} onPress={() => setDisplayTime(!displayTime)} style={{
            paddingHorizontal: 15,
            paddingVertical: 12,
            borderRadius: 20,
            backgroundColor: '#eee',
            marginVertical: 5,
            textAlign: 'left'
          }}>
            <Text style={{
              color: 'black',
              fontSize: 16,
              maxWidth: Dimensions.get('window').width * 3 / 4
            }}>{item.message} </Text>
          </TouchableOpacity>

          <Collapse isOpen={displayTime}>
            <Text style={{
              marginHorizontal: 10,
              marginBottom: 5,
              fontSize: 12,
              color: '#999'
            }}>{fun.displayTimeV2(item.createdAt)}</Text>
          </Collapse>
        </View>
      )}

    </View>
  )
}