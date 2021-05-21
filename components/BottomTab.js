
import React, {useState, useEffect} from 'react';
import { Text, TextInput, View, TouchableOpacity, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationEvents } from 'react-navigation'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import { Camera } from 'expo-camera';

export default function BottomTab(){
  return(
    <Tab.Navigator  
      tabBarOptions={{
        activeTintColor: '#2196F3',
        inactiveTintColor: 'black',
        showLabel: false
      }}
    >
      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={30}/>
          ),
        }} 
        name="Home" 
        component={HomeScreen}
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="search" color={color} size={30}/>
          ),
        }} 
        name="Search" 
        component={SearchScreen}
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="add-circle" color={color} size={30}/>
          ),
        }} 
        name="Add" 
        component={AddScreen} 
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="message" color={color} size={30}/>
          ),
        }} 
        name="Messages" 
        component={MessagesScreen} 
        
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={30}/>
          ),
        }} 
        name="Account" 
        component={AccountScreen} 
      />
    </Tab.Navigator>
  )
}


function HomeScreen(){
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  )
}

function SearchScreen(){
  const [query, setQuery] = useState('');

  function getIcon(){
    if(query.length > 0)
      return <MaterialCommunityIcons onPress={() => setQuery('')} name="close" color={'black'} size={30} style={{position: 'absolute', right: 10, top:8}}/>;
    else
      return;
  }

  return (
    <View style={{ flex: 1, justifyContent:'space-between', }}>
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
            style: { backgroundColor: '#f2f2f2' },
          }}>
          <TopTab.Screen name="Accounts" children={()=><SearchAccounts query={query}/>}/>
          <TopTab.Screen name="Tags" children={()=><SearchTags query={query}/>}/>
        </TopTab.Navigator>
      
    </View>
  )
}

function AddScreen({ navigation }){
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [loaded, setLoaded] = useState(true);

  useEffect(() => 
    navigation.addListener('focus', () => setLoaded(true)),
    []
  );

  useEffect(() => 
    navigation.addListener('blur', () => setLoaded(false)),
    []
  );
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  

  function toggleType(){
    if(type === Camera.Constants.Type.back)
      setType(Camera.Constants.Type.front)
    else if(type === Camera.Constants.Type.front)
      setType(Camera.Constants.Type.back)
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loaded && (
        <Camera style={{width: Dimensions.get('window').width, height:Dimensions.get('window').width*3/4}} type={type} ratio="3:4"></Camera>
      )} 
     
      <TouchableOpacity
        onPress={toggleType}
        style={{
          marginTop: 50,
          padding: 10,
          borderRadius: 6,
          backgroundColor: '#2196F3',
        }}
      >
        <Text style={{color: 'white'}}> Flip </Text>
      </TouchableOpacity>
    </View>
  )
}

function MessagesScreen(){
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Messages!</Text>
    </View>
  )
}

function AccountScreen(){
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Account!</Text>
    </View>
  )
}

function SearchAccounts(props){
  return(
    <ScrollView style={{padding: 20}}>
      <Text>Accounts</Text>
      <Text>{props.query}</Text>
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