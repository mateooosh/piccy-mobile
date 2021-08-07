import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, View, TouchableOpacity, Button, StyleSheet, ScrollView, Dimensions, Image, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import {API_URL, API_URL_WS} from '@env';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

export default function SearchScreen({navigation}){
  const [query, setQuery] = useState('');

  function getIcon(){
    if(query.length > 0)
      return <MaterialIcons onPress={() => setQuery('')} name="close" color={'black'} size={30} style={{position: 'absolute', right: 10, top:8}}/>;
    else
      return;
  }

  

  return (
    <View style={{ flex: 1, justifyContent:'space-between' }}>
      <View style={{marginHorizontal: 20, marginTop: 20, marginBottom: 10}}>
        <TextInput 
          onChangeText={(str) => setQuery(str)} 
          style={{backgroundColor: '#ddd', paddingHorizontal: 20, borderRadius: 15, fontSize: 16, height: 46}}
          placeholder="Type here..." 
          value={query}
        />
        {getIcon()}
      </View>
      <TopTab.Navigator tabBarOptions={{
          activeTintColor:'#2196F3',
          inactiveTintColor: 'black',
          style: { backgroundColor: '#f2f2f2' }
        }}>
        <TopTab.Screen name="Accounts" children={()=><SearchAccounts query={query} navigation={navigation}/>}/>
        <TopTab.Screen name="Tags" children={()=><SearchTags query={query}/>}/>
      </TopTab.Navigator>
      
    </View>
  )
}

function SearchAccounts(props){
  const [result, setResult] = useState([]);

  const [time, setTime] = useState(setTimeout(() => {}, 0));

  useEffect(() => {
    clearTimeout(time);
    setTime(setTimeout(getAccounts, 250));
    return () => clearTimeout(time);
  }, [props])

  function getAccounts(){
    // console.log(API_URL)
    const url = `${API_URL}/users/${props.query}`;
    console.log(url)
    fetch(url)
    .then(response => response.json())
    .then(response => {
      console.log('search accounts: ', response);
      setResult(response);
    })
    .catch(err => console.log(err));
  }


  return(
    <ScrollView style={{paddingHorizontal: 10, paddingVertical: 20}}>
      { result.map((item, idx) => 
        <View key={idx} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10, marginHorizontal: 15}}>
          <TouchableOpacity 
            activeOpacity={0.8}
            style={{ marginRight: 15}} 
            onPress={()=>props.navigation.push('Profile', {username: item.username})}
          >
            {item.photo !== null &&
              <Image 
                source={{ uri: item.photo }} 
                style={{ width: 50, height: 50, borderRadius: 50}} 
              /> 
            }
            {item.photo === null &&
              <MaterialIcons name="account-circle" color={'black'} size={50} />
            }
          </TouchableOpacity>

          <View style={{flexGrow: 1}}>
            <Text 
              style={{fontWeight: '700', fontSize: 15}} 
              onPress={()=>props.navigation.push('Profile', {username: item.username})}
            >
              {item.username}
            </Text>
            <Text style={{color: '#555'}}>
              {item.name}
            </Text>
          </View>

          <View>
            <Text style={{fontWeight: '700', fontSize: 15, textAlign: 'center'}}>
              {item.followers}
            </Text>
            <Text style={{color: '#555'}}>
              Followers
            </Text>
          </View>

        </View>
      )}
    </ScrollView>
  )
}

function SearchTags(props){
  return(
    <ScrollView style={{padding: 20}}>
       <Text>Tags</Text>
       <Text>{props.query}</Text>
    </ScrollView>
  )
}