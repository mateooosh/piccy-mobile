import React, {useState} from 'react';
import {useStore, useSelector} from 'react-redux';
import {StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView, Button, ActivityIndicator} from 'react-native';
import {Divider} from 'react-native-elements';
import {API_URL} from '@env';

export default function LogIn({navigation}) {
  const store = useStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const logged = useSelector(state => state.logged);

  function logIn(username, password) {
    setLoading(true);

    let obj = {
      username: username,
      password: password,
    };

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

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{paddingHorizontal: '10%', paddingTop: '10%'}}>
        <View>
          <Text style={styles.label}>Username</Text>
          <TextInput
            onSubmitEditing={logIn.bind(this, username, password)}
            onChangeText={(str) => setUsername(str)}
            style={styles.input}
            placeholder="Username"
            autoCompleteType="username"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            onSubmitEditing={logIn.bind(this, username, password)}
            onChangeText={(str) => setPassword(str)}
            style={styles.input}
            secureTextEntry={true}
            placeholder="Password"
            autoCompleteType="password"
          />

          <TouchableOpacity onPress={logIn.bind(this, username, password)} style={styles.button}>
            {!loading &&
            <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Log in</Text>
            }
            {loading &&
            <ActivityIndicator size={19} color="white"/>
            }
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 40}}>
          <Divider style={{backgroundColor: 'black'}}/>
          <Text style={{textAlign: 'center', marginVertical: 20}}>You don't have an account on Piccy? <Text
            onPress={() => navigation.push('Register')} style={{color: '#2196F3', fontWeight: '700'}}>Sign up
            here</Text></Text>
        </View>

      </ScrollView>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
  label: {
    fontWeight: '700',
    fontSize: 16
  },
  input: {
    // paddingVertical: 8,
    // fontSize: 16,
    // marginBottom: 30,
    // borderBottomWidth: 1,
    // borderBottomColor: 'grey',
    // borderLeftWidth: 0,

    backgroundColor: '#ddd', paddingHorizontal: 15, borderRadius: 10, fontSize: 16, paddingVertical: 8, marginTop: 10,
    marginBottom: 30,

  },
  button: {
    marginTop: 50,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    color: 'white'
  }
});
