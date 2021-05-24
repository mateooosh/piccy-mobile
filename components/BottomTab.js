
import React, {useState, useEffect} from 'react';
import { Text, TextInput, View, TouchableOpacity, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

//import screens
import AddScreen from './AddScreen.js';
import HomeScreen from './HomeScreen.js';

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
            <MaterialIcons name="home" color={color} size={30}/>
          ),
        }} 
        name="Home" 
        component={HomeScreen}
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="search" color={color} size={30}/>
          ),
        }} 
        name="Search" 
        component={SearchScreen}
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="add-circle" color={color} size={30}/>
          ),
        }} 
        name="Add" 
        component={AddScreen} 
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="message" color={color} size={30}/>
          ),
        }} 
        name="Messages" 
        component={MessagesScreen} 
        
      />

      <Tab.Screen 
        options={{
          tabBarIcon: ({color}) => (
            <MaterialIcons name="account-circle" color={color} size={30}/>
          ),
        }} 
        name="Account" 
        component={AccountScreen} 
      />
    </Tab.Navigator>
  )
}

function SearchScreen(){
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
            style: { backgroundColor: '#f2f2f2' },
          }}>
          <TopTab.Screen name="Accounts" children={()=><SearchAccounts query={query}/>}/>
          <TopTab.Screen name="Tags" children={()=><SearchTags query={query}/>}/>
        </TopTab.Navigator>
      
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