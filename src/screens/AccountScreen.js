
import React, {useState, useEffect} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useStore } from 'react-redux'
import {API_URL} from '@env';

export default function AccountScreen({navigation}){
  const store = useStore();

  const [profile, setProfile] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log(API_URL)
    const url = `${API_URL}/users?idUser=${store.getState().id}`;
    fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log(response);
      setProfile(response);


      fetch(`${API_URL}/posts?idUser=${store.getState().id}&onlyUserPosts=true`)
      .then(response => response.json())
      .then(response => {
        console.log(response);
        setPosts(response);
        
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, [])


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      { profile.map((item) => 
          <ScrollView 
            key={item.id} 
            style={{paddingTop: 10, width: '100%'}} 
            contentContainerStyle={{alignItems: 'center'}}
          >
            { item.photo !== null &&
              <Image 
                source={{ uri: item.photo }} 
                style={{ width: 150, height: 150, borderRadius: 150, margin: 10}}
              />
            }
            { item.photo === null &&
              <MaterialIcons 
                name="account-circle" 
                color={'black'} 
                size={150} 
                style={{margin: 10}}
              />
            }
            
            <Text style={{fontWeight: '700', fontSize: 16}}>{item.username}</Text>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 15, padding: 10}}>
              <View style={{width: '33%'}}>
                <View><Text style={{textAlign: 'center', fontWeight: '700', fontSize: 18}}>{item.postsAmount}</Text></View>
                <View><Text style={{textAlign: 'center', fontSize: 16}}>Posts</Text></View>
              </View>
              <TouchableOpacity 
                style={{width: '33%'}}
                onPress={() => navigation.push('Followers', {id: item.id})} 
              >
                <View><Text style={{textAlign: 'center', fontWeight: '700', fontSize: 18}}>{item.followers}</Text></View>
                <View><Text style={{textAlign: 'center', fontSize: 16}}>Followers</Text></View>
              </TouchableOpacity>
              <View style={{width: '33%'}}>
                <View><Text style={{textAlign: 'center', fontWeight: '700', fontSize: 18}}>{item.following}</Text></View>
                <View><Text style={{textAlign: 'center', fontSize: 16}}>Following</Text></View>
              </View>
            </View>


            <View style={{paddingHorizontal: 20, textAlign: 'left', width: '100%', marginTop: 10}}>
              <Text style={{fontSize: 15, fontWeight: '700', fontSize: 16}}>{item.name}</Text>
              <Text style={{fontSize: 14}}>{item.description}</Text>

              <TouchableOpacity 
                onPress={() => alert('edit profile')} 
                style={{paddingLeft: 20, paddingVertical: 6, width: '100%', backgroundColor:'#2196F3', borderRadius: 6, marginVertical: 20}}
              >
                <Text style={{textAlign: 'center', color: 'white'}}>Edit Profile</Text>
              </TouchableOpacity>
            </View>

            
            
            <View style={{width: '100%'}}>
              <Text style={{fontSize: 22, fontWeight: '700', textAlign: 'left', paddingLeft: 20, marginBottom: 10}}>Posts</Text>
              {posts.length < 1 &&
                <ActivityIndicator 
                  size={60} 
                  color="#2196F3" 
                  style={{marginVertical: 40}}
                />
              }
              <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
                { posts.map((post) => 
                  <TouchableOpacity 
                    activeOpacity={0.8} 
                    key={post.id} 
                    onPress={() => navigation.push('Post', {id: post.id})}
                  >
                    <Image 
                      source={{ uri: post.photo }} 
                      style={{width: Dimensions.get('window').width/3-4, height: Dimensions.get('window').width/3-4, margin: 2}}
                    />
                  </TouchableOpacity>
                )
                }
              </View>
            </View>
          </ScrollView>
        )
      }
    </View>
  )
}