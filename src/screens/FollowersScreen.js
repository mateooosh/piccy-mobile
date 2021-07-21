
import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';


import { useStore } from 'react-redux'
import {API_URL} from '@env';

import UserItem from '../components/UserItem';

export default function FollowersScreen({route, navigation}){
  // const store = useStore();

  // const [profile, setProfile] = useState([]);
  // const [posts, setPosts] = useState([]);

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    // console.log(API_URL)
    console.log('mounted followers')
    // console.log(route.params.id)
    const url = `${API_URL}/followers/${route.params.id}`;
    fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      setFollowers(response);
    })
    .catch(err => console.log(err));

    return function cleanup() {
      setFollowers([]);
    } 
  }, [route.params.id])


  return (
    <ScrollView style={{paddingHorizontal: 10, paddingVertical: 20, height: '100%'}}>
      { followers.map((item, idx) => 
        <UserItem item={item} key={idx} navigation={navigation}/>
      )}

      { followers.length === 0 &&
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%', paddingVertical: 10}}>
          <Text>NO ONE FOLLOWING THIS USER</Text>
        </View>
      }
    </ScrollView>
  )
}