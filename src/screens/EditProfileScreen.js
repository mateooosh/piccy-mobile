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
import {validation, checkStatus} from "../functions/functions";
import Toast from "react-native-toast-message";

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

  function checkError(err) {
    if (err.status == 405) {
      store.dispatch({type: 'resetStore'});
      Toast.show({
        type: 'error',
        text1: t.error[lang],
        text2: t.youHaveBeenLoggedOutBecauceOfToken[lang]
      });

    } else
      console.log(err)
  }


  useEffect(() => {
    const url = `${API_URL}/users/${store.getState().id}/get?token=${store.getState().token}`;

    fetch(url)
      .then(checkStatus)
      .then(response => {
        setPhoto(response.photo);
        setUsername(response.username);
        setEmail(response.email);
        setName(response.name || '');
        setDescription(response.description || '');
        setHasData(true);
        console.log(response);
      })
      .catch(checkError)
  }, [])

  async function editProfile() {
    const url = `${API_URL}/users/${store.getState().id}`;

    const index = photo.indexOf(',');
    let base64 = photo.slice(index + 1, (photo.length));

    const obj = {
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
      .then(checkStatus)
      .then(response => {
        Toast.show({
          type: 'success',
          text1: t.success[lang],
          text2: response.message[lang]
        });
        navigation.push('Piccy', {screen: 'account'});
      })
      .catch(checkError)
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
    if (allCorrect()) {
      return (
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
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Save changes</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <ScrollView
      style={{paddingHorizontal: 20, paddingVertical: 20, minHeight: '100%', backgroundColor: 'white'}}
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
                   autoCompleteType="email" errorMessage={t.emailIsNotValid[lang]} editable={false}/>
          </View>

          <View style={{marginBottom: 20}}>
            <Input value={username} label={t.username[lang]} placeholder={t.username[lang]} onChangeText={setUsername}
                   onSubmitEditing={() => console.log('submit')} isCorrect={correctUsername()}
                   autoCompleteType="username" errorMessage={t.usernameAtLeast6[lang]}
                   editable={false}/>
          </View>

          <View style={{marginBottom: 20}}>
            <Input value={name} label={t.name[lang]} placeholder={t.name[lang]} onChangeText={setName}
                   onSubmitEditing={() => console.log('submit')} isCorrect={correctName()}
                   autoCompleteType="name" errorMessage={t.nameAtLeast3[lang]}/>
          </View>

          <View style={{marginBottom: 20}}>
            <Text style={styles.label}>
              {t.description[lang]}
            </Text>
            <TextInput
              onChangeText={(str) => setDescription(str)}
              style={{
                backgroundColor: '#eee',
                paddingVertical: 5,
                marginTop: 10,
                paddingHorizontal: 15,
                borderRadius: 10,
                textAlignVertical: 'top',
                fontSize: 16
              }}
              multiline={true}
              numberOfLines={3}
              placeholder={t.description[lang]}
              value={description}
            />
          </View>


          {getButton()}

        </View>
      )}
    </ScrollView>
  );
}
