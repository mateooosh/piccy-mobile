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
import colors from '../colors/colors';
import styles from '../styles/style';


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
    const url = `${API_URL}/users/${store.getState().id}/get?token=${store.getState().token}`;


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
      photo: base64,
      token: store.getState().token
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

          <Text style={styles.label}>
            Username
          </Text>
          <TextInput
            onSubmitEditing={() => console.log('submit')}
            onChangeText={(str) => setUsername(str)}
            style={styles.input}
            placeholder="Username"
            value={username}
          />

          <Text style={styles.label}>
            E-mail
          </Text>
          <TextInput
            onSubmitEditing={() => console.log('submit')}
            onChangeText={(str) => setEmail(str)}
            style={styles.input}
            placeholder="E-mail"
            value={email}
          />

          <Text style={styles.label}>
            Name
          </Text>
          <TextInput
            onSubmitEditing={() => console.log('submit')}
            onChangeText={(str) => setName(str)}
            style={styles.input}
            placeholder="Name"
            value={name}
          />

          <Text style={styles.label}>
            Description
          </Text>
          <TextInput
            onChangeText={(str) => setDescription(str)}
            style={{
              textAlignVertical: 'top',
            }}
            style={styles.input}
            multiline={true}
            numberOfLines={ 5 }
            placeholder="Description"
            value={description}
          />


          <TouchableOpacity onPress={editProfile} style={styles.button}>
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
