import React, {useState, useRef} from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Divider} from "react-native-elements";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/style';
import {API_URL} from '@env';
import {checkStatus} from '../functions/functions';

import {t} from '../translations/translations';
import {AlertDialog, Button} from "native-base";
import colors from "../colors/colors";
import Toast from "react-native-toast-message";

export default function SettingsScreen({navigation}) {
  const store = useStore();
  const lang = useSelector(state => state.lang);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const onCloseDelete = () => setIsOpenDelete(false);
  const cancelRefDelete = useRef();

  function logOut() {
    store.dispatch({type: 'resetStore'});
    // store.dispatch({type: 'logged/false'});
    // store.dispatch({type: 'tokenSet', payload: ''});
    // store.dispatch({type: 'usernameSet', payload: ''});
    // store.dispatch({type: 'idSet', payload: ''});
    // store.dispatch({type: 'notificationAmountSet', payload: 0});
  }

  function deleteAccount() {
    setIsLoading(true);
    const url = `${API_URL}/users/${store.getState().id}`;
    fetch(url, {
      method: 'DELETE',
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
        })
        logOut();
      })
      .catch(err => {
        checkError(err);
        Toast.show({
          type: 'error',
          text1: t.error[lang],
          text2: t.somethingWentWrong[lang]
        })
      })
      .finally(() => setIsLoading(false))
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

  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'stretch', backgroundColor: 'white'}}>
      <ScrollView>
        <AlertDialog
          leastDestructiveRef={cancelRefDelete}
          isOpen={isOpenDelete}
          onClose={onCloseDelete}
          motionPreset={"fade"}
        >
          <AlertDialog.Content>
            <AlertDialog.Header fontSize="lg" fontWeight="bold">
              {t.deleteAccount[lang]}
            </AlertDialog.Header>
            <AlertDialog.Body>
              {t.areYouSureYouWantToDeleteThisAccount[lang]}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                style={{backgroundColor: 'white'}}
                variant='outline'
                colorScheme='gray'
                ref={cancelRefDelete}
                onPress={onCloseDelete}
              >
                {t.cancel[lang]}
              </Button>

              <Button
                style={{backgroundColor: colors.danger}}
                onPress={deleteAccount}
                ml={3}
              >
                {isLoading ? (
                  <ActivityIndicator color={'white'}/>
                ) : (
                  t.deleteAccount[lang]
                )}
              </Button>

            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>

        <TouchableOpacity style={styles.option} onPress={() => setIsOpenDelete(true)}>
          <MaterialCommunityIcons style={styles.icon} name="account-remove" size={30}/>
          <Text style={{fontSize: 16}}>{t.deleteAccount[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('ReportBug')}>
          <MaterialIcons style={styles.icon} name="bug-report" size={30}/>
          <Text style={{fontSize: 16}}>{t.reportBug[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('Language')}>
          <MaterialIcons style={styles.icon} name="language" size={30}/>
          <Text style={{fontSize: 16}}>{t.language[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('ResetPassword')}>
          <MaterialIcons style={styles.icon} name="lock-outline" size={30}/>
          <Text style={{fontSize: 16}}>{t.resetPassword[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={logOut}>
          <MaterialIcons style={styles.icon} name="logout" color={'black'} size={30}/>
          <Text style={{fontSize: 16, fontWeight: '700'}}>{t.logOut[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
