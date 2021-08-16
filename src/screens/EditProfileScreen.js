import React, {useState, useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator, TextInput,
} from "react-native";

import {useStore} from "react-redux";
import {API_URL} from "@env";
import colors from '../colors/colors'


import UserItem from "../components/UserItem";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen({route, navigation}) {
  const store = useStore();

  const [photo, setPhoto] = useState('');
  const [hasData, setHasData] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const url = `${API_URL}/users/${store.getState().id}/get`;


    fetch(url)
      .then(response => response.json())
      .then(response => {
        setPhoto(response.photo);
        setUsername(response.username);
        setEmail(response.email);
        setName(response.name || '');
        setDescription(response.description || '');
        setHasData(true);
        console.log(response);
      })
      .catch(err => console.log(err))
  }, [])

  async function editProfile() {
    const url = `${API_URL}/users/${store.getState().id}`;

    const index = photo.indexOf(',');
    let base64 = photo.slice(index + 1, (photo.length));

    const obj = {
      username: username,
      email: email,
      name: name,
      description: description,
      photo: base64
    }

    if (loading)
      return;

    setLoading(true);

    fetch(url, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        alert(response.message);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });


    if (!result.cancelled) {
      setPhoto(`data:image/webp;base64,${result.base64}`);
    }
  };

  return (
    <ScrollView
      style={{paddingHorizontal: 10, paddingVertical: 20, height: "100%"}}
    >
      {hasData && (
        <View>
          <TouchableOpacity style={{alignItems: 'center'}} onPress={pickImage}>
            {photo !== null && (
              <Image
                source={{ uri: photo }}
                style={{ width: 150, height: 150, borderRadius: 150, marginBottom: 10 }}
              />
            )}
            {photo === null && (
              <MaterialIcons
                name="account-circle"
                color={"black"}
                size={150}
                style={{ margin: 10 }}
              />
            )}
          </TouchableOpacity>

          <Text style={{fontWeight: '700', fontSize: 16}}>
            Username
          </Text>
          <TextInput
            onSubmitEditing={() => console.log('submit')}
            onChangeText={(str) => setUsername(str)}
            style={{
              backgroundColor: '#ddd',
              paddingHorizontal: 15,
              borderRadius: 10,
              fontSize: 16,
              paddingVertical: 10,
              marginVertical: 10
            }}
            placeholder="Username"
            value={username}
          />

          <Text style={{fontWeight: '700', fontSize: 16}}>
            E-mail
          </Text>
          <TextInput
            onSubmitEditing={() => console.log('submit')}
            onChangeText={(str) => setEmail(str)}
            style={{
              backgroundColor: '#ddd',
              paddingHorizontal: 15,
              borderRadius: 10,
              fontSize: 16,
              paddingVertical: 10,
              marginVertical: 10
            }}
            placeholder="E-mail"
            value={email}
          />

          <Text style={{fontWeight: '700', fontSize: 16}}>
            Name
          </Text>
          <TextInput
            onSubmitEditing={() => console.log('submit')}
            onChangeText={(str) => setName(str)}
            style={{
              backgroundColor: '#ddd',
              paddingHorizontal: 15,
              borderRadius: 10,
              fontSize: 16,
              paddingVertical: 10,
              marginVertical: 10
            }}
            placeholder="Name"
            value={name}
          />

          <Text style={{fontWeight: '700', fontSize: 16}}>
            Description
          </Text>
          <TextInput
            onChangeText={(str) => setDescription(str)}
            style={{
              backgroundColor: '#ddd',
              paddingHorizontal: 15,
              borderRadius: 10,
              fontSize: 16,
              paddingVertical: 8,
              marginVertical: 10,
              textAlignVertical: 'top'
            }}
            multiline={true}
            numberOfLines={ 3 }
            placeholder="Description"
            value={description}
          />


          <TouchableOpacity onPress={editProfile} style={{
            padding: 10,
            borderRadius: 6,
            backgroundColor: colors.main,
            color: 'white',
            marginTop: 10
          }}>
            {!loading && (
              <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>
                Save changes
              </Text>
            )}
            {loading && (
              <ActivityIndicator size={19} color="white"/>
            )}
          </TouchableOpacity>

        </View>
      )}
    </ScrollView>
  );
}
