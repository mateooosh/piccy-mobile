import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useStore} from 'react-redux'
import {API_URL} from '@env';
import Post from '../components/Post'


// //import my functions
const fun = require('../functions/functions');
import colors from '../colors/colors'



export default function PostScreen({route, navigation}) {
  const store = useStore();

  const [post, setPost] = useState([]);

  useEffect(() => {
    console.log(route.params.id);

    const url = `${API_URL}/posts/${route.params.id}?idUser=${store.getState().id}`;

    fetch(url)
      .then(response => response.json())
      .then(response => {
        // console.log(response);
        setPost(response);
      })
      .catch(err => console.log(err));
  }, [])

  function updatePosts (post) {
    let deepCopy = JSON.parse(JSON.stringify(post));
    deepCopy.forEach((item) => {
      if (item.id == post.id) {
        item = post;
      }
    });
    setPost(deepCopy);
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps="always">
        {post.length < 1 &&
          <ActivityIndicator size={60} color={colors.main} style={{marginVertical: 40}}/>
        }
        {post.map((post, idx) =>
          <Post
            post={post}
            idx={idx}
            key={idx}
            navigation={navigation}
            displayComments={true}
            updatePosts={updatePosts}
          />
        )}
      </ScrollView>
    </View>
  )
}