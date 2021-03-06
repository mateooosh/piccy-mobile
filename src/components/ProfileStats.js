import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import colors from '../colors/colors';
import styles from "../styles/style";
import {useSelector} from "react-redux";
import {t} from "../translations/translations";

export default function ProfileStats({navigation, idUser, followers, following, postsAmount}) {
  const lang = useSelector(state => state.lang);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 15,
        paddingVertical: 10,
        paddingHorizontal: 20
      }}
    >
      <View style={{
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: 'white',
        ...styles.shadow
      }}>
        <View><Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 18,
          color: colors.primary
        }}>{postsAmount}</Text></View>
        <View><Text style={{textAlign: 'center', fontSize: 16}}>{t.posts2[lang]}</Text></View>
      </View>
      <TouchableOpacity
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 8,
          marginRight: 10,
          backgroundColor: 'white',
          ...styles.shadow
        }}
        onPress={() => navigation.push('Followers', {id: idUser})}
      >
        <View><Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 18,
          color: colors.primary
        }}>{followers}</Text></View>
        <View><Text style={{textAlign: 'center', fontSize: 16}}>{t.followers[lang]}</Text></View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: 'white',
          ...styles.shadow
        }}
        onPress={() => navigation.push('Following', {id: idUser})}
      >
        <View><Text style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 18,
          color: colors.primary
        }}>{following}</Text></View>
        <View><Text style={{textAlign: 'center', fontSize: 16}}>{t.following[lang]}</Text></View>
      </TouchableOpacity>
    </View>

  )
}