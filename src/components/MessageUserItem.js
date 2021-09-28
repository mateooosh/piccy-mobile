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
    <TouchableOpacity onPress={() => props.navigation.push('Channel', {idUser: props.channel.idUser})}
                      style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: 'white'}}>
      {props.channel.photo !== null && (
        <Image
          source={{uri: props.channel.photo}}
          style={{width: 50, height: 50, borderRadius: 50}}
        />
      )}
      {props.channel.photo === null && (
        <MaterialIcons name="account-circle" color={"black"} size={50}/>
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