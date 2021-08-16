import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {useStore} from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import fun from '../functions/functions'

export default function MessageUserItem(props) {

  const store = useStore();

  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(props.item)
  }, [props])

  return (
    <TouchableOpacity onPress={() => props.navigation.push('Channel', {idChannel: props.channel.idChannel})}
                      style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 15}}>
      {props.channel.photo !== null && (
        <Image
          source={{uri: props.channel.photo}}
          style={{width: 60, height: 60, borderRadius: 60}}
        />
      )}
      {props.channel.photo === null && (
        <MaterialIcons name="account-circle" color={"black"} size={60}/>
      )}

      <View style={{flexGrow: 1, marginLeft: 10, flex: 1, justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontWeight: '700', fontSize: 15, flexGrow: 1, paddingBottom: 6}}>{props.channel.username}</Text>
          <Text style={{fontWeight: '700'}}>{fun.displayTimeV2(props.channel.createdAt)}</Text>
        </View>
        <Text numberOfLines={1} style={{color: '#444'}}>{props.channel.lastMessage}</Text>

      </View>
    </TouchableOpacity>
  )
}