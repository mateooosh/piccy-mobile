import React, {useState} from 'react';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Divider} from 'react-native-elements';
import {API_URL} from '@env';
import colors from "../colors/colors";
import styles from '../styles/style';
import Input from '../components/Input';
import {validation} from "../functions/functions";

export default function RegisterScreen({navigation}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);

  function createAccount(username, email, password, name) {
    let obj = {
      username: username,
      email: email,
      password: password,
      name: name
    };

    setLoading(true);

    const url = `${API_URL}/users`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(response => {
        alert(response.message);
        navigation.push('Home');
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }

  function correctEmail() {
    return validation.email(email);
  }

  function correctUsername() {
    return validation.min6Chars(username);
  }

  function correctPassword() {
    return validation.min6Chars(password);
  }

  function correctName() {
    return validation.min3Chars(name);
  }

  function allCorrect() {
    return correctEmail() && correctUsername() && correctPassword() && correctName();
  }

  function getButton() {
    if (allCorrect()) {
      return (
        <TouchableOpacity onPress={createAccount.bind(this, username, email, password, name)} style={styles.button}>
          {!loading &&
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Create account</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Create account</Text>
        </TouchableOpacity>
      )
    }
  }


  return (
    <View style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{paddingHorizontal: '10%', paddingTop: '10%'}}
      >
        <View style={{display: 'flex', flexDirection: 'column', gap: 30}}>
          {/*<Text style={styles.label}>E-mail</Text>*/}
          {/*<TextInput */}
          {/*  onSubmitEditing={createAccount.bind(this,username,email,password,name)} */}
          {/*  onChangeText={(str) => setEmail(str)} */}
          {/*  style={styles.input} */}
          {/*  placeholder="E-mail" */}
          {/*  autoCompleteType="email"*/}
          {/*/>*/}

          <Input value={email} label={'E-mail'} placeholder={'E-mail'} onChangeText={setEmail}
                 onSubmitEditing={createAccount.bind(this, username, email, password, name)} isCorrect={correctEmail()}
                 autoCompleteType="email" errorMessage="E-mail is not valid"/>

          <Input value={username} label={'Username'} placeholder={'Username'} onChangeText={setUsername}
                 onSubmitEditing={createAccount.bind(this, username, email, password, name)}
                 isCorrect={correctUsername()}
                 autoCompleteType="username" errorMessage="Username must be at least 6 characters long"/>

          <Input value={password} label={'Password'} placeholder={'Password'} onChangeText={setPassword}
                 onSubmitEditing={createAccount.bind(this, username, password)} isCorrect={correctPassword()}
                 autoCompleteType="password" errorMessage="Password must be at least 6 characters long"
                 secureTextEntry={true}/>

          <Input value={name} label={'Name'} placeholder={'Name'} onChangeText={setName}
                 onSubmitEditing={createAccount.bind(this, username, email, password, name)} isCorrect={correctName()}
                 autoCompleteType="name" errorMessage="Name must be at least 3 characters long"/>

          {getButton()}
        </View>

        <View style={{marginTop: 40}}>
          <Divider style={{backgroundColor: '#ddd'}}/>
          <Text style={{textAlign: 'center', marginVertical: 20}}>Already a Piccy member? <Text
            onPress={() => navigation.push('Home')} style={{color: colors.primary, fontWeight: '700'}}>Log in
            here</Text></Text>
        </View>

      </ScrollView>
    </View>
  );
}
