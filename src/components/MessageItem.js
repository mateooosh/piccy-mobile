import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useStore} from "react-redux";
import colors from '../colors/colors';

import fun from '../functions/functions';
import {Alert, Collapse} from "native-base";

export default function MessageItem(props) {

  const store = useStore();

  const [item, setItem] = useState({});
  const [displayTime, setDisplayTime] = useState(false);

  useEffect(() => {
    setItem(props.item)
  }, [props])

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
            marginLeft: '25%',
            textAlign: 'left'
          }}>
            <Text style={{color: '#fff', fontSize: 16}}>{item.message}</Text>
          </TouchableOpacity>

          <Collapse isOpen={displayTime}>
            <Text style={{marginHorizontal: 10, marginBottom: 5, fontSize: 12, color: '#999'}}>{fun.displayTimeV2(item.createdAt)}</Text>
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
            marginRight: '25%',
            textAlign: 'left'
          }}>
            <Text style={{color: 'black', fontSize: 16}}>{item.message}</Text>
          </TouchableOpacity>

          <Collapse isOpen={displayTime}>
            <Text style={{marginHorizontal: 10, marginBottom: 5, fontSize: 12, color: '#999'}}>{fun.displayTimeV2(item.createdAt)}</Text>
          </Collapse>
        </View>
      )}

    </View>
  )
}