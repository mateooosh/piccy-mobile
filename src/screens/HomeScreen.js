import React, { useEffect, useState } from 'react';
import { Text, ActivityIndicator, View, TouchableOpacity, ScrollView, Dimensions, Image, RefreshControl, ToastAndroid, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore } from 'react-redux';
import {API_URL, API_URL_WS} from '@env';
import { io } from "socket.io-client";


export default function HomeScreen({navigation}){
  const store = useStore();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emptyPosts, setEmptyPosts] = useState(false);


  const onRefresh = React.useCallback(() => {
    setPage(0);
    setPosts([]);
    setEmpyuPosts(false);
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

    const url = `http://localhost:3000/posts?idUser=${store.getState().id}&onlyUserPosts=false&page=${temp}`;
    fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      setLoading(false);
      //push new posts to array
      response.map(item => setPosts(posts => [...posts, item]));
      

      if(!!response.length){
        setPage(temp);
      }
      else{
        setEmptyPosts(true);

        ToastAndroid.showWithGravityAndOffset(
          'No more posts',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          150
        );
      }
    })
    .catch(err => console.log(err));
  }

  useEffect(() => {
    console.log('home mounted');

    const socket = io(API_URL_WS, { transports : ['websocket']});

    socket.emit('new user', store.getState().username);
    
    getPosts();
  }, [])

  function likePost(idUser, idPost, index){
    const url = `${API_URL}/likes`;
    console.log(JSON.stringify({idUser: idUser, idPost: idPost}));
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({idUser: idUser, idPost: idPost}),
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(response => {     
      let deepCopy = JSON.parse(JSON.stringify(posts));
      deepCopy[index].likes++;
      deepCopy[index].liked = 1;
      setPosts(deepCopy);

      ToastAndroid.showWithGravityAndOffset(
        'Liked',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        150
      );
      // alert(response.message);
    })
    .catch(err => console.log(err))
  }

  function dislikePost(idUser, idPost, index){
    const url = `${API_URL}/likes`;
    fetch(url, {
      method: 'DELETE',
      body: JSON.stringify({idUser: idUser, idPost: idPost}),
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(response => {     
      let deepCopy = JSON.parse(JSON.stringify(posts));
      deepCopy[index].likes--;
      deepCopy[index].liked = 0;
      setPosts(deepCopy);

      ToastAndroid.showWithGravityAndOffset(
        'Disliked',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        150
      );
    })
    .catch(err => console.log(err))
  }

  function displayTime(date){
    let now = new Date();
    let diff = now - new Date(date);

    const minute = 1000*60;
    const hour = 1000*60*60;
    const day = 1000*60*60*24;

    if(diff < minute)
      return 'Now';
    else if (diff >= minute && diff < hour){
      return (Math.floor(diff/minute) === 1) ? Math.floor(diff/minute) + ' minute ago' : Math.floor(diff/minute) + ' minutes ago';
    }
    else if (diff >= hour && diff < day){
      return (Math.floor(diff/hour) === 1) ? Math.floor(diff/hour) + ' hour ago' : Math.floor(diff/hour) + ' hours ago';
    }
    else if (diff >= day && diff < 7 * day){
      return (Math.floor(diff/day) === 1) ? Math.floor(diff/day) + ' day ago' : Math.floor(diff/day) + ' days ago';
    }
    else if (diff >= 7 * day && diff < 365.25 * day){
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()];
    }

    else if (diff >= day * 365.25){
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
    }
  }

  


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView 
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
          />
        }>
        {posts.length < 1 &&
          <ActivityIndicator size={60} color="#2196F3" style={{marginVertical: 40}}/>
        }
        {posts.map((post, idx) => 
          <View key={post.id} style={{marginBottom: 10, backgroundColor: 'white', paddingVertical: 12}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12 , marginHorizontal: 15}}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={{ marginRight: 15}} 
                onPress={()=>navigation.navigate('Profile', {username: post.username})}
              >
                {post.userPhoto !== null &&
                  <Image 
                    source={{ uri: post.userPhoto }} 
                    style={{ width: 40, height: 40, borderRadius: 50}} 
                  /> 
                }
                {post.userPhoto === null &&
                  <MaterialIcons name="account-circle" color={'black'} size={40} />
                }
              </TouchableOpacity>
              
              <View>
                <Text 
                  style={{fontWeight: '700', fontSize: 15}} 
                  onPress={() => navigation.navigate('Profile', {username: post.username})}>
                  {post.username}
                </Text>
                <Text style={{fontWeight: '500', fontSize: 12, color: '#777'}}>{displayTime(post.uploadDate)}</Text>
              </View>
            </View>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Post', {id: post.id})}
            >
              <Image 
                source={{ uri: post.photo }} 
                style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width}} 
              />  
            </TouchableOpacity>
            

            <View style={{flexDirection:'row',  marginVertical: 10, justifyContent: 'space-around'}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {post.liked === 0 &&
                  <MaterialCommunityIcons onPress={likePost.bind(this, store.getState().id, post.id, idx)} name="heart-outline" color={'black'} size={30}/>
                }

                {post.liked === 1 &&
                  <MaterialCommunityIcons onPress={dislikePost.bind(this, store.getState().id, post.id, idx)} name="heart" color={'#E40000'} size={30}/>
                }
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons onPress={() => alert('Comment')} name="comment-outline" color={'black'} size={30}/>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <MaterialIcons onPress={() => alert('Share')} name="share" color={'black'} size={30}/>
              </View>
              
             
            </View>
            
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text style={{marginHorizontal: 15, fontWeight: '700', fontSize: 13}}>{post.likes} likes</Text>
              <Text style={{fontWeight: '700', fontSize: 13}}>{post.comments} comments</Text>
            </View>

            <Text style={{marginHorizontal: 15, fontSize: 13}}>
              <Text 
                style={{fontWeight: '700'}} 
                onPress={() => navigation.navigate('Profile', {username: post.username})}
              >
                {post.username + ' '} 
              </Text>
              
              {post.description.split(' ').map((word, index) => {
                if(word.charAt(0) === '#')
                  return <Text key={index} onPress={() => alert(`push to ${word} tag`)} style={{color: '#1F72FF'}}>{word} </Text>
                else
                  return <Text key={index}>{word} </Text>
              })}
            </Text>
          </View>
          )  
        }

        {!!posts.length && !emptyPosts &&
          <TouchableOpacity onPress={getPosts} style={{marginHorizontal: 15, marginVertical: 10, padding: 10, borderRadius: 6, backgroundColor: '#2196F3', color: 'white'}}>
            {!loading &&
              <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>More</Text>
            }
            {loading &&
              <ActivityIndicator size={19} color="white"/>
            }
          </TouchableOpacity>
        }
      
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 50,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    color: 'white',
  },
});