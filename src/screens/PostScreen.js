import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useStore} from 'react-redux'
import {API_URL, API_URL_WS} from '@env';
import Post from '../components/Post'


// //import my functions
const fun = require('../functions/functions');
import colors from '../colors/colors'
import {checkStatus, displayToast} from "../functions/functions";
import {useToast} from "native-base";
import {t} from "../translations/translations";
import Toast from "react-native-toast-message";


export default function PostScreen({route, navigation}) {
  const store = useStore();
  const toast = useToast();
  const lang = useSelector(state => state.lang);

  const [post, setPost] = useState([]);

  useEffect(() => {
    const url = `${API_URL}/posts/${route.params.id}?idUser=${store.getState().id}&token=${store.getState().token}`;

    fetch(url)
      .then(checkStatus)
      .then(response => {
        // console.log(response);
        setPost(response);
      })
      .catch(checkError);
  }, [])

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
      <ScrollView keyboardShouldPersistTaps="always">
        {post.length < 1 &&
          <ActivityIndicator size={60} color={colors.primary} style={{marginVertical: 40}}/>
        }
        {post.map((post, idx) =>
          <Post
            post={post}
            idx={idx}
            key={idx}
            navigation={navigation}
            homeScreen={false}
          />
        )}
      </ScrollView>
    </View>
  )
}