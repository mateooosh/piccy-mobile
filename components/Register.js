
import React, {useState} from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView , Button } from 'react-native';
import { Divider } from 'react-native-elements';

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

    const url = `http://10.10.0.156:3000/users`;
    fetch(url, {
      method: "POST",
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
    <View style={styles.container} >
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{paddingHorizontal: '10%', paddingTop: '10%'}}>
        <View>
          <Text style={styles.label}>E-mail</Text>
          <TextInput onSubmitEditing={createAccount.bind(this,username,email,password,name)} onChangeText={(str) => setEmail(str)} style={styles.input} placeholder="E-mail" autoCompleteType="email"/>

          <Text style={styles.label}>Username</Text>
          <TextInput onSubmitEditing={createAccount.bind(this,username,email,password,name)} onChangeText={(str) => setUsername(str)} style={styles.input} placeholder="Username" autoCompleteType="username"/>
          
          <Text style={styles.label}>Password</Text>
          <TextInput onSubmitEditing={createAccount.bind(this,username,email,password,name)} onChangeText={(str) => setPassword(str)} style={styles.input} secureTextEntry={true} placeholder="Password" autoCompleteType="password"/>

          <Text style={styles.label}>Name</Text>
          <TextInput onSubmitEditing={createAccount.bind(this,username,email,password,name)} onChangeText={(str) => setName(str)} style={styles.input} placeholder="Name" autoCompleteType="name"/>
          
          <TouchableOpacity onPress={createAccount.bind(this,username,email,password,name)} style={styles.button}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Create account</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{marginTop: 40}}>
          <Divider style={{ backgroundColor: 'black'}} />
          <Text style={{textAlign:'center', marginVertical: 20}}>Already a Piccy member? <Text onPress={()=>navigation.navigate('Home')} style={{color: '#2196F3', fontWeight:'700'}}>Log in here</Text></Text>
        </View>
        
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label:{
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
    color: 'white',
  },
});

