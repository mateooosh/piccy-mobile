import React from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import fun from '../functions/functions'

export default function MessageUserItem(props) {

  return (
    <TouchableOpacity onPress={() => props.navigation.push('Chat', {idUser: props.channel.idUser})}
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

          {props.channel.status ? (
            <Text style={{fontWeight: '700', fontSize: 13}}>{fun.displayTimeV2(props.channel.createdAt)}</Text>
          ) : (
            <Text style={{fontWeight: '400', fontSize: 13}}>{fun.displayTimeV2(props.channel.createdAt)}</Text>
          )}
        </View>
        {props.channel.status ? (
          <Text numberOfLines={1} style={{color: '#222', fontWeight: '700'}}>
            {props.channel.lastMessage.startsWith('LINKTOPOST') ? (
              'Link to post'
            ) : (
              props.channel.lastMessage
            )}
          </Text>
        ) : (
          <Text numberOfLines={1} style={{color: '#444', fontWeight: '400'}}>
            {props.channel.lastMessage.startsWith('LINKTOPOST') ? (
              'Link to post'
            ) : (
              props.channel.lastMessage
            )}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}