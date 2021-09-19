import React, {useState, useEffect} from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator, TextInput,
} from "react-native";

import Input from '../components/Input';

import {useStore, useSelector} from "react-redux";
import {API_URL} from "@env";
import styles from '../styles/style';
import {t} from '../translations/translations';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import {validation} from "../functions/functions";

export default function EditProfileScreen({route, navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);

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
  }

  function correctEmail() {
    return validation.email(email);
  }

  function correctUsername() {
    return validation.min6Chars(username);
  }

  function correctName() {
    return validation.min3Chars(name);
  }

  function allCorrect() {
    return correctEmail() && correctUsername() && correctName();
  }

  function getButton() {
    if(allCorrect()) {
      return(
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
      )
    } else {
      return(
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Save changes</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <ScrollView
      style={{paddingHorizontal: 20, paddingVertical: 20, height: "100%"}}
    >
      {hasData && (
        <View>
          <TouchableOpacity style={{alignItems: 'center', marginBottom: 20}} onPress={pickImage}>
            {photo !== null && (
              <Image
                source={{uri: photo}}
                style={{width: 150, height: 150, borderRadius: 150}}
              />
            )}
            {photo === null && (
              <MaterialIcons
                name="account-circle"
                color={"black"}
                size={150}
                style={{margin: 10}}
              />
            )}
          </TouchableOpacity>

          <View style={{marginBottom: 20}}>
            <Input value={email} label={'E-mail'} placeholder={'E-mail'} onChangeText={setEmail}
                   onSubmitEditing={() => console.log('submit')} isCorrect={correctEmail()}
                   autoCompleteType="email" errorMessage="E-mail is not valid"/>
          </View>

          <View style={{marginBottom: 20}}>
            <Input value={username} label={t.username[lang]} placeholder={t.username[lang]} onChangeText={setUsername}
                   onSubmitEditing={() => console.log('submit')} isCorrect={correctUsername()}
                   autoCompleteType="username" errorMessage="Username must be at least 6 characters long"/>
          </View>

          <View style={{marginBottom: 20}}>
            <Input value={name} label={'Name'} placeholder={'Name'} onChangeText={setName}
                   onSubmitEditing={() => console.log('submit')} isCorrect={correctName()}
                   autoCompleteType="name" errorMessage="Name must be at least 3 characters long"/>
          </View>

          <View style={{marginBottom: 20}}>
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
              numberOfLines={5}
              placeholder="Description"
              value={description}
            />
          </View>


          {getButton()}

        </View>
      )}
    </ScrollView>
  );
}
