import React, {useState, useEffect} from 'react';
import {useStore} from "react-redux";
import {Text, View, ScrollView} from 'react-native';

import {API_URL} from '@env';

import UserItem from '../components/UserItem';

export default function FollowingScreen({route, navigation}) {
  const store = useStore();

  // const [profile, setProfile] = useState([]);
  // const [posts, setPosts] = useState([]);

  const [following, setFollowing] = useState([]);
  const [hasData, setHasData] = useState(false);


  useEffect(() => {
    const url = `${API_URL}/following/${route.params.id}?token=${store.getState().token}`;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setFollowing(response);
        setHasData(true);
      })
      .catch(err => console.log(err));

    return function cleanup() {
      setFollowing([]);
    }
  }, [route.params.id])


  return (
    <ScrollView style={{paddingHorizontal: 10, height: '100%', backgroundColor: 'white'}}>
      {following.map((item, idx) =>
        <UserItem item={item} key={idx} navigation={navigation}/>
      )}

      {hasData && following.length === 0 &&
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        paddingVertical: 10
      }}>
        <Text>NO ONE IS FOLLOWING BY THIS USER</Text>
      </View>
      }
    </ScrollView>
  )
}