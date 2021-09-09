
import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';
import { Divider } from 'react-native-elements';
import {API_URL} from '@env';
import colors from "./colors/colors";
import styles from './styles/style'

export default function Register({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  function createAccount(username,email,password,name){
    let obj = {
      username: username,
      email: email,
      password: password,
      name: name
    };

    const url = `${API_URL}/users`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(response => alert(response.message))
    .catch(err => console.log(err))
  }

  return (
    <View style={{flex: 1}} >
      <ScrollView 
        keyboardShouldPersistTaps='handled' 
        contentContainerStyle={{paddingHorizontal: '10%', paddingTop: '10%'}}
      >
        <View>
          <Text style={styles.label}>E-mail</Text>
          <TextInput 
            onSubmitEditing={createAccount.bind(this,username,email,password,name)} 
            onChangeText={(str) => setEmail(str)} 
            style={styles.input} 
            placeholder="E-mail" 
            autoCompleteType="email"
          />

          <Text style={styles.label}>Username</Text>
          <TextInput 
            onSubmitEditing={createAccount.bind(this,username,email,password,name)} 
            onChangeText={(str) => setUsername(str)} 
            style={styles.input} 
            placeholder="Username" 
            autoCompleteType="username"
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            onSubmitEditing={createAccount.bind(this,username,email,password,name)} 
            onChangeText={(str) => setPassword(str)} 
            style={styles.input} 
            secureTextEntry={true} 
            placeholder="Password" 
            autoCompleteType="password"
          />

          <Text style={styles.label}>Name</Text>
          <TextInput 
            onSubmitEditing={createAccount.bind(this,username,email,password,name)} 
            onChangeText={(str) => setName(str)} 
            style={styles.input} 
            placeholder="Name" 
            autoCompleteType="name"
          />
          
          <TouchableOpacity onPress={createAccount.bind(this,username,email,password,name)} style={styles.button}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Create account</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{marginTop: 40}}>
          <Divider style={{ backgroundColor: 'black'}} />
          <Text style={{textAlign:'center', marginVertical: 20}}>Already a Piccy member? <Text onPress={()=>navigation.push('Home')} style={{color: colors.primary, fontWeight:'700'}}>Log in here</Text></Text>
        </View>
        
      </ScrollView>
    </View>
  );
}
