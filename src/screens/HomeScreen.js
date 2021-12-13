import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  ActivityIndicator,
  View,
  ScrollView,
  RefreshControl, Dimensions
} from 'react-native';
import {useSelector, useStore} from 'react-redux';
import {API_URL, API_URL_WS} from '@env';
import Post from '../components/Post';
import colors from '../colors/colors';

import {t} from "../translations/translations";
import {checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

export default function HomeScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emptyPosts, setEmptyPosts] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(true);

  const onRefresh = useCallback(() => {
    setActivityIndicator(true);
    setPage(0);
    setPosts([]);
    setEmptyPosts(false);
    getPosts();

    // setTimeout(()=> {
    //   setRefreshing(false);
    // }, 2000)
  }, []);

  function getPosts() {
    if(emptyPosts || loading)
      return;

    let temp = page + 1;
    setLoading(true);
    console.log('ti', API_URL)

    const url = `${API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=false&page=${temp}&token=${store.getState().token}`;
    fetch(url)
      .then(checkStatus)
      .then(response => {
        console.log(response);
        //push new posts to array
        response.map(item => setPosts(posts => [...posts, item]));

        if (!!response.length) {
          setPage(temp);
        } else {
          setEmptyPosts(true);
        }
      })
      .catch(checkError)
      .finally(() => {
        setLoading(false);
        setActivityIndicator(false);
      })
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

  useEffect(() => {
    getPosts();
  }, [])

  function onScroll(e) {
    if(e.nativeEvent.contentOffset.y + Dimensions.get('window').height + 200 > e.nativeEvent.contentSize.height) {
      console.log('should update');
      getPosts();
    }
  }

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[colors.primary]}/>
        }
        onScroll={onScroll}
      >
        {activityIndicator && (
          <ActivityIndicator
            size={60}
            color={colors.primary}
            style={{marginVertical: 40}}
          />
        )}

        {posts.map((post, idx) => (
          <Post
            post={post}
            idx={idx}
            key={idx}
            navigation={navigation}
            homeScreen={true}
          />
        ))}

        {loading && !activityIndicator && (
          <ActivityIndicator
            size={40}
            color={colors.primary}
            style={{paddingBottom: 10, marginTop: 2}}
          />
        )}

        {!posts.length && !activityIndicator &&
          <Text style={{fontSize: 16, marginVertical: 20}}>You need to follow someone</Text>
        }

      </ScrollView>
    </View>
  );
}