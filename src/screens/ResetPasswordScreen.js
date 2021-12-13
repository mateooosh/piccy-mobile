import React, {useState} from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import styles from "../styles/style";
import {API_URL} from "@env";
import {validation, checkStatus} from '../functions/functions';
import Input from "../components/Input";

import {t} from '../translations/translations';
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
  const store = useStore();

  const lang = useSelector(state => state.lang);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function resetPassword() {
    const url = `${API_URL}/reset/password`;
    const obj = {
      idUser: store.getState().id,
      oldPassword: oldPassword,
      newPassword: newPassword,
      token: store.getState().token
    }

    setLoading(true);
    fetch(url, {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(checkStatus)
      .then(response => {
        Toast.show({
          type: 'success',
          text1: t.success[lang],
          text2: response.message[lang]
        });
      })
      .catch(checkError)
      .finally(() => {
        setLoading(false);
        setNewPassword('');
        setOldPassword('');
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

  function disableButton() {
    return validation.min6Chars(oldPassword) && validation.min6Chars(newPassword);
  }

  function getButton() {
    if (disableButton()) {
      return (
        <TouchableOpacity onPress={resetPassword} style={styles.button}>
          {!loading &&
          <Text style={styles.button.text}>{t.resetPassword[lang]}</Text>
          }
          {loading &&
          <ActivityIndicator size={19} color="white"/>
          }
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity style={styles.buttonDisabled}>
          <Text style={styles.button.text}>{t.resetPassword[lang]}</Text>
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{paddingHorizontal: 20, paddingTop: 20}}>
        <View style={{marginBottom: 30}}>
          <Input value={oldPassword} label={t.oldPassword[lang]} onSubmitEditing={resetPassword}
                 onChangeText={setOldPassword}
                 secureTextEntry={true} placeholder={t.oldPassword[lang]}/>
        </View>

        <View style={{marginBottom: 30}}>
          <Input value={newPassword} label={t.newPassword[lang]} onSubmitEditing={resetPassword}
                 onChangeText={setNewPassword}
                 secureTextEntry={true} placeholder={t.newPassword[lang]}/>
        </View>

        {getButton()}
      </ScrollView>
    </View>
  )
}
