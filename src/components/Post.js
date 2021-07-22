import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useStore, useSelector } from 'react-redux'
import {API_URL} from '@env';

export default function Post(props) {

  const store = useStore();

  

  return(
    <View key={props.post.id} style={{marginBottom: 10, backgroundColor: 'white', paddingVertical: 12}}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 12 , marginHorizontal: 15}}>
        <TouchableOpacity 
          activeOpacity={0.8}
          style={{ marginRight: 15}} 
          onPress={()=>props.navigation.navigate('Profile', {username: props.post.username})}
        >
          {props.post.userPhoto !== null &&
            <Image 
              source={{ uri: props.post.userPhoto }} 
              style={{ width: 40, height: 40, borderRadius: 50}} 
            /> 
          }
          {props.post.userPhoto === null &&
            <MaterialIcons name="account-circle" color={'black'} size={40} />
          }
        </TouchableOpacity>
        
        <View>
          <Text 
            style={{fontWeight: '700', fontSize: 15}} 
            onPress={() => props.navigation.navigate('Profile', {username: props.post.username})}>
            {props.post.username}
          </Text>
          <Text style={{fontWeight: '500', fontSize: 12, color: '#777'}}>{props.displayTime(props.post.uploadDate)}</Text>
        </View>
      </View>
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('Post', {id: props.post.id})}
      >
        <Image 
          source={{ uri: props.post.photo }} 
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width}} 
        />  
      </TouchableOpacity>
      

      <View style={{flexDirection:'row',  marginVertical: 10, justifyContent: 'space-around'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {props.post.liked === 0 &&
            <MaterialCommunityIcons onPress={props.likePost.bind(this, store.getState().id, props.post.id, props.idx)} name="heart-outline" color={'black'} size={30}/>
          }

          {props.post.liked === 1 &&
            <MaterialCommunityIcons onPress={props.dislikePost.bind(this, store.getState().id, props.post.id, props.idx)} name="heart" color={'#E40000'} size={30}/>
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
        <Text style={{marginHorizontal: 15, fontWeight: '700', fontSize: 13}}>{props.post.likes} likes</Text>
        <Text style={{fontWeight: '700', fontSize: 13}}>{props.post.comments} comments</Text>
      </View>

      <Text style={{marginHorizontal: 15, fontSize: 13}}>
        <Text 
          style={{fontWeight: '700'}} 
          onPress={() => props.navigation.navigate('Profile', {username: props.post.username})}
        >
          {props.post.username + ' '} 
        </Text>
        
        {props.post.description.split(' ').map((word, index) => {
          if(word.charAt(0) === '#')
            return <Text key={index} onPress={() => alert(`push to ${word} tag`)} style={{color: '#1F72FF'}}>{word} </Text>
          else
            return <Text key={index}>{word} </Text>
        })}
      </Text>
    </View>
  )
}