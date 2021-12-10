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
import styles from "../styles/style";
import {t} from "../translations/translations";
import {checkStatus, displayToast} from "../functions/functions";
import {useToast} from "native-base";
import Toast from "react-native-toast-message";

export default function AccountScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getProfile();
  }, [])


  function getProfile() {
    console.log('get profile')
    const url = `${API_URL}/users?idUser=${store.getState().id}&token=${store.getState().token}`;
    setLoading(true);
    fetch(url)
      .then(checkStatus)
      .then(response => {
        setProfile(response);

        fetch(`${API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=true&token=${store.getState().token}`)
          .then(checkStatus)
          .then(response => {
            // console.log(response);
            setPosts(response);
            setLoading(false);
            console.log(loading)
          })
          .catch(checkError);
      })
      .catch(checkError);
  }

  function checkError(err) {
    if(err.status == 405) {
      store.dispatch({type: 'resetStore'});
      Toast.show({
        type: 'error',
        text1: t.error[lang],
        text2: t.youHaveBeenLoggedOutBecauceOfToken[lang]
      });
    }
    else
      console.log(err);
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
            <Text style={{fontSize: 14, marginVertical: 5}}>{item.description}</Text>

            <TouchableOpacity
              onPress={() => navigation.push('EditProfile')}
              style={{...styles.button, ...styles.shadow, marginVertical: 12}}
            >
              <Text style={{textAlign: 'center', ...styles.button.text}}>{t.editProfile[lang]}</Text>
            </TouchableOpacity>
          </View>

          <ProfilePosts posts={posts} loading={loading} navigation={navigation}/>

        </ScrollView>
      )}
    </View>
  )
}