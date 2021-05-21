import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, TouchableOpacity, Text, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function Picker() {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity 
          onPress={pickImage}
          style={{
            marginVertical: 10,
            padding: 15,
            borderRadius: 15,
            backgroundColor: '#2196F3',
          }}>
        <Text style={{color: 'white'}}>Pick an image from your gallery</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').width*3/4 }} />}
    </View>
  );
}