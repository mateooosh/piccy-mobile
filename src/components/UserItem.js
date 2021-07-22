import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function UserItem (props) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginHorizontal: 15}}>
      <TouchableOpacity 
        activeOpacity={0.8}
        style={{ marginRight: 15}} 
        onPress={()=>props.navigation.push('Profile', {username: props.item.username})}
      >
        {props.item.userPhoto !== null &&
          <Image 
            source={{ uri: props.item.userPhoto }} 
            style={{ width: 50, height: 50, borderRadius: 50}} 
          /> 
        }
        {props.item.userPhoto === null &&
          <MaterialIcons name="account-circle" color={'black'} size={50} />
        }
      </TouchableOpacity>

      <View style={{flexGrow: 1}}>
        <Text 
          style={{fontWeight: '700', fontSize: 15}} 
          onPress={()=>props.navigation.push('Profile', {username: props.item.username})}
        >
          {props.item.username}
        </Text>
        <Text style={{color: '#555'}}>
          {props.item.name}
        </Text>
      </View>

      <View>
        <Text style={{fontWeight: '700', fontSize: 15, textAlign: 'center'}}>
          {props.item.followers}
        </Text>
        <Text style={{color: '#555'}}>
          Followers
        </Text>
      </View>
    </View>
  )
}