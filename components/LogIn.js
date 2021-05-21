
import React, {useState} from 'react';
import { useStore, useSelector } from 'react-redux'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView , Button } from 'react-native';
import { Divider } from 'react-native-elements';

export default function LogIn({ navigation }) {
  const store = useStore();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // const logged = useSelector(state => state.logged);
  
  function logIn(username,password){
    let obj = {
      username: username,
      password: password,
    };

    const url = `http://10.10.0.156:3000/auth`;
    fetch(url, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
      'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(response => {
      alert(response.message);
      store.dispatch({ type: "logged/true" });
      store.dispatch({ type: "tokenSet", payload: response.token });
      store.dispatch({ type: "usernameSet", payload: response.username });
      store.dispatch({ type: "idSet", payload: response.id });
      console.log(store.getState());
    })
    .catch(err => alert("Something went wrong!"))
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{paddingHorizontal: '10%', paddingTop: '10%'}}>
        <View>
          <Text style={styles.label}>Username</Text>
          <TextInput 
            onSubmitEditing={logIn.bind(this,username,password)} 
            onChangeText={(str) => setUsername(str)} 
            style={styles.input} 
            placeholder="Username" 
            autoCompleteType="username"
          />
          
          <Text style={styles.label}>Password</Text>
          <TextInput 
            onSubmitEditing={logIn.bind(this,username,password)} 
            onChangeText={(str) => setPassword(str)} 
            style={styles.input} 
            secureTextEntry={true} 
            placeholder="Password" 
            autoCompleteType="password"
          />

          <TouchableOpacity onPress={logIn.bind(this,username,password)} style={styles.button}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Log in</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{marginTop: 40}}>
          <Divider style={{ backgroundColor: 'black'}} />
          <Text style={{textAlign:'center', marginVertical: 20}}>You don't have an account on Piccy? <Text onPress={()=>navigation.navigate('Register')} style={{color: '#2196F3', fontWeight:'700'}}>Sign up here</Text></Text>
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
  label:{
    fontWeight: '700',
    fontSize: 16
  },
  input: {
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    borderLeftWidth: 0,
    
  },
  button: {
    marginTop: 50,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#2196F3',
    color: 'white',
  },
});
