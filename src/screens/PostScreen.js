
import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore } from 'react-redux'
import {API_URL} from '@env';

export default function PostScreen({route, navigation}){
  const store = useStore();

  const [post, setPost] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    console.log(route.params.id);
    const url = `${API_URL}/posts/${route.params.id}?idUser=${store.getState().id}`;
    fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      setPost(response);
      displayTime(response[0].uploadDate);

      const urlComments = `${API_URL}/comments/${route.params.id}`;
      fetch(urlComments)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setComments(response);
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
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
      setPost(deepCopy);

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

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
      return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()];
    }

    else if (diff >= day * 365.25){
      return new Date(date).getDate() + ' ' + monthNames[new Date(date).getMonth()] + ' ' + new Date(date).getFullYear();
    }
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <ScrollView style={{paddingBottom: 10}}>
        {post.length < 1 &&
          <ActivityIndicator size={60} color="#2196F3" style={{marginVertical: 40}}/>
        }
        {post.map((post, idx) => 
          <View key={post.id}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 12, marginHorizontal: 15}}>
              <TouchableOpacity 
                activeOpacity={0.8}
                style={{ marginRight: 15}} 
                onPress={()=>navigation.push('Profile', {username: post.username})}
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
                  onPress={() => navigation.push('Profile', {username: post.username})}>
                  {post.username}
                </Text>
                <Text style={{fontWeight: '500', fontSize: 12, color: '#777'}}>{displayTime(post.uploadDate)}</Text>
              </View>
            </View>
            <Image 
              source={{ uri: post.photo }} 
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width}} 
            />    
            

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
                style={{fontWeight: '700', marginRight: 5}} 
                onPress={() => navigation.push('Profile', {username: post.username})}
              >
                {post.username} 
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

        <Text style={{color: '#555', marginHorizontal: 15, marginTop: 10}}>Comments</Text>

        {comments.map((comment, idx) =>
          <View key={idx} style={{marginHorizontal: 15, marginVertical: 2, display: 'block'}}>
            <Text 
              style={{fontWeight: '700', fontSize: 13, marginRight: 5}} 
              onPress={() => navigation.push('Profile', {username: comment.username})}
            >
              {comment.username}
            </Text>
            <Text style={{fontSize: 13}}>{comment.content}</Text>
          </View>
        )} 
      </ScrollView>
    </View>
  )
}