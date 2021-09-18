import React, {useEffect, useState} from 'react';
import {
  Alert,
  Text,
  ActivityIndicator,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ToastAndroid
} from 'react-native';
import {useStore} from 'react-redux';
import {API_URL, API_URL_WS} from '@env';
import {io} from "socket.io-client";
import Post from '../components/Post';
import colors from '../colors/colors';

import {useToast} from 'native-base';

// import { theme } from 'native-base';

console.log(API_URL)

export default function HomeScreen({navigation}) {
  const store = useStore();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emptyPosts, setEmptyPosts] = useState(false);

  const toast = useToast();


  const onRefresh = React.useCallback(() => {
    setPage(0);
    setPosts([]);
    setEmptyPosts(false);
    getPosts();
    ToastAndroid.showWithGravityAndOffset(
      'Refreshed',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      150
    );

    // setTimeout(()=> {
    //   setRefreshing(false);
    // }, 2000)
  }, []);

  function getPosts() {
    let temp = page + 1;
    setLoading(true);
    console.log('ti', API_URL)

    const url = `${API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=false&page=${temp}&token=${store.getState().token}`;
    fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setLoading(false);
        //push new posts to array
        response.map(item => setPosts(posts => [...posts, item]));


        if (!!response.length) {
          setPage(temp);
        } else {
          setEmptyPosts(true);

          // ToastAndroid.showWithGravityAndOffset(
          //   'No more posts',
          //   ToastAndroid.SHORT,
          //   ToastAndroid.BOTTOM,
          //   0,
          //   150
          // );
        }
      })
      .catch(err => console.log(err));
  }

  function updatePosts(post) {
    let deepCopy = JSON.parse(JSON.stringify(posts));
    deepCopy.forEach((item) => {
      if (item.id == post.id) {
        item = post;
      }
    });
    console.log(posts[0], deepCopy[0])
    setPosts(deepCopy);
  }

  useEffect(() => {

    toast.show({
      title: 'Home mounted',
      duration: 3000
    })

    console.log('home mounted');

    const socket = io(API_URL_WS, {transports: ['websocket']});

    socket.emit('new-user', store.getState().username);

    // socket.on('test', (v) => {
    //   console.log('test', v)
    // })

    socket.on('message', (v) => {
      console.log('message', v)
    })

    getPosts();
  }, [])


  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={[colors.primary]}/>
        }
      >
        {posts.length < 1 && (
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
            updatePosts={updatePosts}
          />
        ))}

        {!!posts.length && !emptyPosts && (
          <TouchableOpacity
            onPress={getPosts}
            style={{
              marginHorizontal: 15,
              marginVertical: 10,
              padding: 10,
              borderRadius: 6,
              backgroundColor: colors.primary,
              color: "white",
            }}
          >
            {!loading && (
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "700",
                }}
              >
                More
              </Text>
            )}
            {loading && <ActivityIndicator size={19} color="white"/>}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}