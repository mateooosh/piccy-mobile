import React, {useEffect, useState} from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Divider} from 'react-native-elements';
import {API_URL} from '@env';
import colors from '../colors/colors';
import styles from '../styles/style';
import {validation, checkStatus} from '../functions/functions';
import {Alert, Collapse} from 'native-base';
import Input from '../components/Input';
import {t} from "../translations/translations";
import Toast from "react-native-toast-message";

export default function LoginScreen({navigation}) {
  const store = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const lang = useSelector(state => state.lang);

  const [alertIsOpen, setAlertIsOpen] = useState(false);

  useEffect(() => {

  }, [])

  function correctUsername() {
    return validation.min6Chars(username);
  }

  function correctPassword() {
    return validation.min6Chars(password);
  }

  function logIn(username, password) {
    if (!correctUsername() || !correctPassword())
      return;

    setLoading(true);

    const obj = {
      username: username,
      password: password,
    }

    console.log(obj);

    const url = `${API_URL}/auth`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(checkStatus)
      .then(response => {
        // alert(response.message);
        console.log('token:', response.token)
        store.dispatch({type: "tokenSet", payload: response.token});
        store.dispatch({type: "usernameSet", payload: response.username});
        store.dispatch({type: "idSet", payload: response.id});

        Toast.show({
          type: 'success',
          text1: response.message[lang]
        });

        setLoading(false);
        store.dispatch({type: "logged/true"});
      })
      .catch(err => {
        checkError(err);
        setAlertIsOpen(true);
        setLoading(false);

        setTimeout(() => {
          setAlertIsOpen(false);
        }, 3000);
      })
  }

  function checkError(err) {
    if(err.status == 405) {
      store.dispatch({type: 'resetStore'});
      Toast.show({
        type: 'error',
        text1: t.error[lang],
        text2: t.youHaveBeenLoggedOutBecauceOfToken[lang]
      });
    }
    else
      console.log(err);
  }

  function getButton() {
    if (correctUsername() && correctPassword()) {
      return (
        <TouchableOpacity onPress={logIn.bind(this, username, password)} style={styles.button}>
          {!loading &&
          <Text style={styles.button.text}>{t.logIn[lang]}</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={styles.button.text}>{t.logIn[lang]}</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{padding: 32}}>

        <View style={{display: 'flex', flexDirection: 'column'}}>
          <Input value={username} label={t.username[lang]} placeholder={t.username[lang]} onChangeText={setUsername}
                 onSubmitEditing={logIn.bind(this, username, password)} isCorrect={correctUsername()}
                 autoCompleteType="username" errorMessage={t.usernameAtLeast6[lang]}
                 marginBottom={40}/>
          <Input value={password} label={t.password[lang]} placeholder={t.password[lang]} onChangeText={setPassword}
                 onSubmitEditing={logIn.bind(this, username, password)} isCorrect={correctPassword()}
                 autoCompleteType="password" errorMessage={t.passwordAtLeast6[lang]}
                 secureTextEntry={true}
                 marginBottom={40}/>

          {getButton()}

        </View>

        <Collapse isOpen={alertIsOpen}>
          <Alert w="100%" status={'error'} marginTop={7}>
            <Alert.Icon/>
            <Alert.Description>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text>{t.usernameOrPasswordIsInvalid[lang]}</Text>
              </View>
            </Alert.Description>
          </Alert>
        </Collapse>

        <View style={{marginTop: 40}}>
          <Divider style={{backgroundColor: '#ddd'}}/>
          <Text style={{textAlign: 'center', marginVertical: 20}}>{t.youDontHaveAnAccount[lang]}
            <Text
              onPress={() => navigation.push('Register')} style={{color: colors.primary, fontWeight: '700'}}>
              {t.signUpHere[lang]}
            </Text>
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}
