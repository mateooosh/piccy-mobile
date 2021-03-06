import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_URL} from '@env';
import {useStore, useSelector} from 'react-redux';
import ProfileStats from '../components/ProfileStats';
import ProfilePosts from '../components/ProfilePosts';
import {t} from '../translations/translations';
import styles from '../styles/style';
import {checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

export default function AccountScreen({route, navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  useEffect(() => {
    console.log(route.params.username);
  }, []);

  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    //if this is my account
    if (route.params.username === store.getState().username) {
      navigation.navigate('Piccy', {screen: 'account'});
      return;
    } else {
      // get information about profile
      const url = `${API_URL}/users?username=${route.params.username}&myIdUser=${store.getState().id}&token=${store.getState().token}`;
      setLoading(true)
      fetch(url)
        .then(checkStatus)
        .then(response => {
          setProfile(response);

          // get user's posts
          fetch(
            `${API_URL}/posts?username=${route.params.username}&onlyUserPosts=true&token=${store.getState().token}`
          )
            .then(checkStatus)
            .then((response) => {
              setPosts(response);
              setLoading(false);
            })
            .catch(checkError);
        })
        .catch(checkError);
    }
  }, []);

  //follow user
  function follow(idUser, idFollower) {
    let deepCopy = JSON.parse(JSON.stringify(profile));
    deepCopy[0].amIFollowing = 1;
    deepCopy[0].followers++;
    setProfile(deepCopy);

    const url = `${API_URL}/users/${idUser}/follow/${idFollower}?token=${store.getState().token}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(checkStatus)
      .then((response) => {
        console.log(response.message);
      })
      .catch(checkError);
  }

  // unfollow user
  function unfollow(idUser, idFollower) {
    let deepCopy = JSON.parse(JSON.stringify(profile));
    deepCopy[0].amIFollowing = 0;
    deepCopy[0].followers--;
    setProfile(deepCopy);

    const url = `${API_URL}/users/${idUser}/follow/${idFollower}?token=${store.getState().token}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(checkStatus)
      .then(response => {
        console.log(response.message);
      })
      .catch(checkError);
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      {profile.map((item) => (
        <ScrollView
          key={item.id}
          style={{paddingTop: 10, width: '100%'}}
          contentContainerStyle={{alignItems: 'center'}}
        >
          {item.photo !== null && (
            <Image
              source={{uri: item.photo}}
              style={{width: 150, height: 150, borderRadius: 150, margin: 10}}
            />
          )}
          {item.photo === null && (
            <MaterialIcons
              name='account-circle'
              color={'black'}
              size={150}
              style={{margin: 10}}
            />
          )}

          <Text style={{fontWeight: '700', fontSize: 16}}>
            {item.username}
          </Text>

          <ProfileStats navigation={navigation} idUser={item.id} followers={item.followers} following={item.following}
                        postsAmount={item.postsAmount}/>

          <View
            style={{
              paddingHorizontal: 20,
              textAlign: 'left',
              width: '100%',
              marginTop: 10,
            }}
          >
            <Text style={{fontWeight: '700', fontSize: 16}}>
              {item.name}
            </Text>
            <Text style={{fontSize: 14, marginVertical: 5}}>{item.description}</Text>

            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginVertical: 16}}>
              {item.amIFollowing === 0 && (
                <TouchableOpacity
                  onPress={follow.bind(this, store.getState().id, item.id)}
                  style={{
                    ...styles.button,
                    flex: 1,
                    marginRight: 10
                  }}
                >
                  <Text style={styles.button.text}>
                    {t.follow[lang]}
                  </Text>
                </TouchableOpacity>
              )}
              {item.amIFollowing === 1 && (
                <TouchableOpacity
                  onPress={unfollow.bind(this, store.getState().id, item.id)}
                  style={{
                    ...styles.buttonDisabled,
                    flex: 1,
                    marginRight: 10
                  }}
                >
                  <Text style={styles.button.text}>
                    {t.following3[lang]}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => navigation.push('Chat', {idUser: item.id})}
                style={{...styles.button, flex: 1}}
              >
                <Text style={styles.button.text}>
                  {t.message[lang]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          <ProfilePosts posts={posts} loading={loading} navigation={navigation}/>

        </ScrollView>
      ))}
    </View>
  );
}
