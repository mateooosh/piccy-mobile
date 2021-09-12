import React, {useState} from 'react';
import {useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import styles from "../styles/style";
import {API_URL} from "@env";
import {validation, displayToast} from '../functions/functions';
import {useToast} from 'native-base';

export default function ResetPasswordScreen() {
  const store = useStore();
  const toast = useToast();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function resetPassword() {
    const url = `${API_URL}/reset/password`;
    const obj = {
      idUser: store.getState().id,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    setLoading(true);
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(response => response.json())
      .then(response => {
        console.log(response.message);
        displayToast(toast, response.message);
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoading(false);
        setNewPassword('');
        setOldPassword('');
      })
  }

  function disableButton() {
    return validation.min6Chars(oldPassword) && validation.min6Chars(newPassword);
  }

  function getButton() {
    if (disableButton()) {
      return (
        <TouchableOpacity onPress={resetPassword} style={styles.button}>
          {!loading &&
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Reset password</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={{color: 'white', textAlign: 'center', fontWeight: '700'}}>Reset password</Text>
        </TouchableOpacity>
      )
    }
  }

  return (

    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <View>
          <Text style={styles.label}>Old password</Text>
          <TextInput
            value={oldPassword}
            onSubmitEditing={resetPassword}
            onChangeText={(str) => setOldPassword(str)}
            style={styles.input}
            secureTextEntry={true}
            placeholder="Old password"
            autoCompleteType="password"
          />

          <Text style={styles.label}>New password</Text>
          <TextInput
            value={newPassword}
            onSubmitEditing={resetPassword}
            onChangeText={(str) => setNewPassword(str)}
            style={styles.input}
            secureTextEntry={true}
            placeholder="New password"
            autoCompleteType="password"
          />

          {getButton()}
        </View>
      </ScrollView>
    </View>
  )
}
