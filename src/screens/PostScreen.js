
import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore } from 'react-redux'
import {API_URL} from '@env';
import Post from '../components/Post'
import { NativeBaseProvider } from 'native-base';


// //import my functions
const fun = require('../functions/functions');



console.log(API_URL);

export default function PostScreen({route, navigation}){
  const store = useStore();

  const [post, setPost] = useState([]);
  // const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log(route.params.id);
    const url = `${API_URL}/posts/${route.params.id}?idUser=${store.getState().id}`;
    fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      setPost(response);

      // const urlComments = `${API_URL}/comments/${route.params.id}`;
      // fetch(urlComments)
      // .then(response => response.json())
      // .then(response => {
      //   console.log(response);
      //   setComments(response);
      // })
      // .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
  }, [])

  


  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>
          {post.length < 1 &&
            <ActivityIndicator size={60} color="#2196F3" style={{marginVertical: 40}}/>
          }
          {post.map((post, idx) => 
            <Post post={post} idx={idx} key={idx}
                  navigation={navigation} displayComments={true}
            />
            )  
          }
        </ScrollView>
      </View>
  )
}