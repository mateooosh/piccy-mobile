import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import {useSelector, useStore} from "react-redux";
import colors from '../colors/colors';

import fun from '../functions/functions';
import {Collapse} from "native-base";


export default React.memo(MessageItem);

function MessageItem({item}) {
  const id = useSelector(state => state.id);
  const store = useStore();
  const [displayTime, setDisplayTime] = useState(false);

  return (
    <View>
      {item.idSender == id && (
        <View style={{alignItems: 'flex-end'}}>
          <Collapse isOpen={displayTime}>
            <Text style={{
              marginHorizontal: 10,
              fontSize: 12,
              color: '#999'
            }}>
              {fun.displayTimeV2(item.createdAt)}
            </Text>
          </Collapse>

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
              maxWidth: Dimensions.get('window').width * 3 / 5
            }}>
              {item.message}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {item.idSender != id && (
        <View style={{alignItems: 'flex-start'}}>
          <Collapse isOpen={displayTime}>
            <Text style={{
              marginHorizontal: 10,
              fontSize: 12,
              color: '#999'
            }}>
              {fun.displayTimeV2(item.createdAt)}
            </Text>
          </Collapse>

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
              maxWidth: Dimensions.get('window').width * 3 / 5
            }}>{item.message} </Text>
          </TouchableOpacity>

        </View>
      )}

    </View>
  )
}