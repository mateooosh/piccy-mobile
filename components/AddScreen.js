import React, {useState, useEffect} from 'react';
import { Text, TextInput, View, TouchableOpacity, Button, StyleSheet, ScrollView, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import { Camera } from 'expo-camera';
import Picker from './Picker.js';


export default function AddScreen({ navigation }){
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [loaded, setLoaded] = useState(true);
  const [flash, setFlash] = useState('off');

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

  function setNextFlashMode(){
    if(flash==='off')
      setFlash('torch');  
    else if(flash==="torch")
      setFlash('on');     
    else if(flash==="on")
      setFlash('auto');
    else if(flash==='auto')
      setFlash('off');
  }

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      {/* {loaded && (
        <Camera style={{width: Dimensions.get('window').width, height:Dimensions.get('window').width*3/4}} type={type} ratio="3:4" flashMode={flash}></Camera>
      )} 
     
      <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems:'flex-end',width: '100%'}}>
        <TouchableOpacity
          onPress={toggleType}
          style={{
            marginVertical: 10,
            padding: 10,
            borderRadius: 15,
            backgroundColor: '#2196F3',
          }}
        >
          <MaterialIcons name="refresh" color={'white'} size={30}/>
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => alert('Make photo!')}
          style={{
            marginVertical: 10,
            padding: 15,
            borderRadius: 15,
            backgroundColor: '#2196F3',
          }}
        >
          <MaterialIcons name="photo-camera" color={'white'} size={50}/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={setNextFlashMode}
          style={{
            marginVertical: 10,
            padding: 10,
            borderRadius: 15,
            backgroundColor: '#2196F3',
          }}
        >
          {flash==='off' ? (
              <MaterialIcons name="flash-off" color={'white'} size={30}/>
            ) : (<></>)
          }
          {flash==='torch' ? (
              <MaterialCommunityIcons name="flashlight" color={'white'} size={30}/>
            ) : (<></>)
          }
          {flash==='on' ? (
              <MaterialIcons name="flash-on" color={'white'} size={30}/>
            ) : (<></>)
          }
          {flash==='auto' ? (
              <MaterialIcons name="flash-auto" color={'white'} size={30}/>
            ) : (<></>)
          }
        </TouchableOpacity>
      </View> */}
      <ScrollView>
        <Picker/>
      </ScrollView>
    </View>
  )
}