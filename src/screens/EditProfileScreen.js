import React, {useState, useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  ActivityIndicator, TextInput,
} from "react-native";

import {useStore} from "react-redux";
import {API_URL} from "@env";
import {colors} from '../colors/colors'

console.log(colors)

import UserItem from "../components/UserItem";

export default function EditProfileScreen({route, navigation}) {
  const store = useStore();

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
        setUsername(response.username);
        setEmail(response.email);
        setName(response.name);
        setDescription(response.description);
        setHasData(true);
        console.log(response);
      })
      .catch(err => console.log(err))
  }, [])

  function editProfile() {
    const url = `${API_URL}/users/${store.getState().id}`;
    const obj = {
      username: username,
      email: email,
      name: name,
      description: description
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
        console.log(response);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  return (
    <ScrollView
      style={{paddingHorizontal: 10, paddingVertical: 20, height: "100%"}}
    >
      {hasData && (
        <View>
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
              marginVertical: 10
            }}
            multiline={true}
            numberOfLines={(description.split('\n').length) > 3 ? (description.split('\n').length) : 3}
            placeholder="Description"
            value={description}
          />


          <TouchableOpacity onPress={editProfile} style={{
            padding: 10,
            borderRadius: 6,
            backgroundColor: '#2196F3',
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
