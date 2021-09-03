import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {useStore} from "react-redux";
import colors from '../colors/colors';


export default function ProfileStats({navigation, idUser, followers, following, postsAmount}) {

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
        width: "100%",
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20
      }}
    >
      <View style={{flex: 1, backgroundColor: '#e5e5e5', paddingVertical: 10, borderRadius: 8}}>
        <View><Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 18,
          color: colors.main
        }}>{postsAmount}</Text></View>
        <View><Text style={{textAlign: 'center', fontSize: 16}}>Posts</Text></View>
      </View>
      <TouchableOpacity
        style={{flex: 1, backgroundColor: '#e5e5e5', paddingVertical: 10, borderRadius: 8}}
        onPress={() => navigation.push('Followers', {id: idUser})}
      >
        <View><Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 18,
          color: colors.main
        }}>{followers}</Text></View>
        <View><Text style={{textAlign: 'center', fontSize: 16}}>Followers</Text></View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{flex: 1, backgroundColor: '#e5e5e5', paddingVertical: 10, borderRadius: 8}}
        onPress={() => navigation.push('Following', {id: idUser})}
      >
        <View><Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 18,
          color: colors.main
        }}>{following}</Text></View>
        <View><Text style={{textAlign: 'center', fontSize: 16}}>Following</Text></View>
      </TouchableOpacity>
    </View>

  )
}