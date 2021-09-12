import React, {useState} from 'react';
import {useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Divider} from 'react-native-elements';
import {API_URL} from '@env';
import colors from './colors/colors';
import styles from './styles/style';
import {validation} from './functions/functions';

import Input from './components/Input';

export default function LogIn({navigation}) {
  const store = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function correctUsername() {
    return validation.min6Chars(username);
  }
  function correctPassword() {
    return validation.min6Chars(password);
  }

  // const logged = useSelector(state => state.logged);

  function logIn(username, password) {
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
        store.dispatch({type: "logged/true"});
        store.dispatch({type: "tokenSet", payload: response.token});
        store.dispatch({type: "usernameSet", payload: response.username});
        store.dispatch({type: "idSet", payload: response.id});
        setLoading(false);
        console.log(store.getState());
      })
      .catch(err => {
        setLoading(false);
        alert("Something went wrong!")
      })
  }

  function getButton() {
    if(correctUsername() && correctPassword()) {
      return(
        <TouchableOpacity onPress={logIn.bind(this, username, password)} style={styles.button}>
          {!loading &&
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Log in</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return(
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Log in</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={{flex: 1}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{paddingHorizontal: '10%', paddingTop: '10%'}}>
        <View style={{display: 'flex', flexDirection: 'column', gap: 30}}>
          <Input label={'Username'} placeholder={'Username'} onChangeText={setUsername}
                 onSubmitEditing={logIn.bind(this, username, password)} isCorrect={correctUsername()}
                 autoCompleteType="username" errorMessage="Username must be at least 6 characters long"/>
          <Input label={'Password'} placeholder={'Password'} onChangeText={setPassword}
                 onSubmitEditing={logIn.bind(this, username, password)} isCorrect={correctPassword()}
                 autoCompleteType="password" errorMessage="Password must be at least 6 characters long"
                 secureTextEntry={true}/>
          {/*<Text style={styles.label}>Username</Text>*/}
          {/*<TextInput*/}
          {/*  onSubmitEditing={logIn.bind(this, username, password)}*/}
          {/*  onChangeText={(str) => setUsername(str)}*/}
          {/*  style={styles.input}*/}
          {/*  placeholder="Username"*/}
          {/*  autoCompleteType="username"*/}
          {/*/>*/}

          {/*<Text style={styles.label}>Password</Text>*/}
          {/*<TextInput*/}
          {/*  onSubmitEditing={logIn.bind(this, username, password)}*/}
          {/*  onChangeText={(str) => setPassword(str)}*/}
          {/*  style={styles.input}*/}
          {/*  secureTextEntry={true}*/}
          {/*  placeholder="Password"*/}
          {/*  autoCompleteType="password"*/}
          {/*/>*/}

          {getButton()}
        </View>

        <View style={{marginTop: 40}}>
          <Divider style={{backgroundColor: 'black'}}/>
          <Text style={{textAlign: 'center', marginVertical: 20}}>You don't have an account on Piccy? <Text
            onPress={() => navigation.push('Register')} style={{color: colors.primary, fontWeight: '700'}}>Sign up
            here</Text></Text>
        </View>

      </ScrollView>
    </View>
  );
}
