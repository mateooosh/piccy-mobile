import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {useSelector, useStore} from 'react-redux'
import {API_URL} from '@env';
import ProfileStats from "../components/ProfileStats";
import ProfilePosts from "../components/ProfilePosts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/style";
import {t} from "../translations/translations";


export default function AccountScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);


  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(API_URL)
    getProfile();
  }, [])


  function getProfile() {
    console.log('get profile')
    const url = `${API_URL}/users?idUser=${store.getState().id}&token=${store.getState().token}`;
    setLoading(true);
    fetch(url)
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        setProfile(response);

        fetch(`${API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=true&token=${store.getState().token}`)
          .then(response => response.json())
          .then(response => {
            // console.log(response);
            setPosts(response);
            setLoading(false);
            console.log(loading)
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      {profile.map((item) =>
        <ScrollView
          key={item.id}
          style={{ width: '100%'}}
          contentContainerStyle={{alignItems: 'center'}}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={getProfile}/>
          }
        >
          {item.photo !== null &&
          <Image
            source={{uri: item.photo}}
            style={{width: 150, height: 150, borderRadius: 150, margin: 10}}
          />
          }
          {item.photo === null &&
          <MaterialIcons
            name="account-circle"
            color={'black'}
            size={150}
            style={{margin: 10}}
          />
          }

          <Text style={{fontWeight: '700', fontSize: 16}}>{item.username}</Text>

          <ProfileStats navigation={navigation} idUser={item.id} followers={item.followers} following={item.following}
                        postsAmount={item.postsAmount}/>

          <View style={{paddingHorizontal: 20, textAlign: 'left', width: '100%', marginTop: 10}}>
            <Text style={{fontWeight: '700', fontSize: 16}}>{item.name}</Text>
            <Text style={{fontSize: 14}}>{item.description}</Text>

            <TouchableOpacity
              onPress={() => navigation.push('EditProfile')}
              style={{...styles.button, ...styles.shadow}}
              // style={{
              //   paddingVertical: 6,
              //   width: '100%',
              //   backgroundColor: colors.primary,
              //   borderRadius: 6,
              //   marginVertical: 20,
              //   shadowColor: "#000",
              //   shadowOffset: {
              //     width: 0,
              //     height: 3,
              //   },
              //   shadowOpacity: 0.27,
              //   shadowRadius: 4.65,
              //   elevation: 6
              // }}
            >
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}}>
                <MaterialCommunityIcons name="account-edit" color='white'
                                        size={20}/>
                <Text style={{textAlign: 'center', color: 'white'}}>{t.editProfile[lang]}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <ProfilePosts posts={posts} loading={loading} navigation={navigation}/>

        </ScrollView>
      )}
    </View>
  )
}