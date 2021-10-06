import React, {useEffect, useState} from 'react';
import {useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Divider} from 'react-native-elements';
import {API_URL} from '@env';
import colors from '../colors/colors';
import styles from '../styles/style';
import {validation, displayToast} from '../functions/functions';
import {useToast} from 'native-base';

import {Alert, Collapse} from 'native-base';

import Input from '../components/Input';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function LoginScreen({navigation}) {
  const store = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const [alertIsOpen, setAlertIsOpen] = useState(false);

  function correctUsername() {
    return validation.min6Chars(username);
  }

  function correctPassword() {
    return validation.min6Chars(password);
  }

  // const logged = useSelector(state => state.logged);

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
      .then(response => response.json())
      .then(response => {
        // alert(response.message);
        console.log('token:', response.token)
        store.dispatch({type: "logged/true"});
        store.dispatch({type: "tokenSet", payload: response.token});
        store.dispatch({type: "usernameSet", payload: response.username});
        store.dispatch({type: "idSet", payload: response.id});
        displayToast(toast, response.message);
      })
      .catch(err => {
        setAlertIsOpen(true);

        setTimeout(() => {
          setAlertIsOpen(false);
        }, 3000);
      })
      .finally(() => setLoading(false))
  }

  function getButton() {
    if (correctUsername() && correctPassword()) {
      return (
        <TouchableOpacity onPress={logIn.bind(this, username, password)} style={styles.button}>
          {!loading &&
          <Text style={styles.button.text}>Log in</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={styles.button.text}>Log in</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{padding: 32}}>

        <View style={{display: 'flex', flexDirection: 'column'}}>
          <Input value={username} label={'Username'} placeholder={'Username'} onChangeText={setUsername}
                 onSubmitEditing={logIn.bind(this, username, password)} isCorrect={correctUsername()}
                 autoCompleteType="username" errorMessage="Username must be at least 6 characters long"
                 marginBottom={30}/>
          <Input value={password} label={'Password'} placeholder={'Password'} onChangeText={setPassword}
                 onSubmitEditing={logIn.bind(this, username, password)} isCorrect={correctPassword()}
                 autoCompleteType="password" errorMessage="Password must be at least 6 characters long"
                 secureTextEntry={true}
                 marginBottom={30}/>

          {getButton()}

        </View>

        <Collapse isOpen={alertIsOpen}>
          <Alert w="100%" status={'error'} marginTop={7}>
            <Alert.Icon/>
            <Alert.Description>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text>Username or password is invalid. Try again.</Text>
                {/*<MaterialIcons onPress={() => setAlertIsOpen(false)} name="close" color={'black'} size={30}/>*/}
              </View>
            </Alert.Description>
          </Alert>
        </Collapse>

        <View style={{marginTop: 40}}>
          <Divider style={{backgroundColor: '#ddd'}}/>
          <Text style={{textAlign: 'center', marginVertical: 20}}>You don't have an account on Piccy? <Text
            onPress={() => navigation.push('Register')} style={{color: colors.primary, fontWeight: '700'}}>Sign up
            here</Text></Text>
        </View>

      </ScrollView>
    </View>
  );
}
