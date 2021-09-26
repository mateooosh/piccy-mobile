import React, {useState, useRef} from 'react';
import {useSelector, useStore} from 'react-redux';
import {Text, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import {Divider} from "react-native-elements";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/style';
import {API_URL} from '@env';
import {displayToast} from '../functions/functions';

import {t} from '../translations/translations';
import {AlertDialog, Button, useToast} from "native-base";
import colors from "../colors/colors";


export default function SettingsScreen({navigation}) {
  const store = useStore();
  const toast = useToast();
  const lang = useSelector(state => state.lang);
  const [isLoading, setIsLoading] = useState(false);

  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const onCloseDelete = () => setIsOpenDelete(false);
  const cancelRefDelete = useRef();

  function logOut() {
    store.dispatch({type: 'logged/false'});
    store.dispatch({type: 'tokenSet', payload: ''});
    store.dispatch({type: 'usernameSet', payload: ''});
    store.dispatch({type: 'idSet', payload: ''});
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
      .then(response => response.json())
      .then(response => {
        displayToast(toast, response.message);
        logOut();
      })
      .catch(err => displayToast(toast, 'Something went wrong!'))
      .finally(() => setIsLoading(false))
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
              Delete account
            </AlertDialog.Header>
            <AlertDialog.Body>
              Are you sure You want to delete your account?
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                style={{backgroundColor: colors.primary}}
                ref={cancelRefDelete}
                onPress={onCloseDelete}
              >
                Cancel
              </Button>

              <Button
                style={{backgroundColor: colors.danger}}
                onPress={deleteAccount}
                ml={3}
              >
                {isLoading ? (
                  <ActivityIndicator color={'white'}/>
                ) : (
                  'Delete account'
                )}
              </Button>

            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>

        <TouchableOpacity style={styles.option} onPress={() => setIsOpenDelete(true)}>
          <MaterialCommunityIcons style={styles.icon} name="account-remove" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Delete account</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('ReportBug')}>
          <MaterialIcons style={styles.icon} name="bug-report" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>Report bug</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('Language')}>
          <MaterialIcons style={styles.icon} name="language" color={'black'} size={30}/>
          <Text style={{fontSize: 16}}>{t.language[lang]}</Text>
          <MaterialIcons style={{flexGrow: 1, textAlign: 'right'}} name="keyboard-arrow-right" color={'#bbb'}
                         size={30}/>
        </TouchableOpacity>

        <Divider color={'#ddd'}/>

        <TouchableOpacity style={styles.option} onPress={() => navigation.push('ResetPassword')}>
          <MaterialIcons style={styles.icon} name="lock-outline" color={'black'} size={30}/>
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
