import React, {useState, useEffect} from 'react';
import { Text, View} from 'react-native';
import {useStore} from "react-redux";
import colors from '../colors/colors'

export default function MessageItem (props) {

  const store = useStore();

  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(props.item)
  }, [props])

  return (
    <View>
      {item.idUser == store.getState().id && (
        <View style={{alignItems: 'flex-end'}}>
          <View style={{paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20, backgroundColor: colors.main, marginVertical: 5, marginLeft: '25%', textAlign: 'left'}}>
            <Text style={{color: '#fff', fontSize: 16}}>{item.message}</Text>
          </View>
        </View>
      )}

      {item.idUser != store.getState().id && (
        <View style={{alignItems: 'flex-start'}}>
          <View style={{paddingHorizontal: 15, paddingVertical: 12, borderRadius: 20, backgroundColor: '#eee', marginVertical: 5, marginRight: '25%', textAlign: 'left'}}>
            <Text style={{color: 'black', fontSize: 16}}>{item.message}</Text>
          </View>
        </View>
      )}
    </View>
  )
}